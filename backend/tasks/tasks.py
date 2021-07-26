from typing import Optional
from dataclasses import dataclass
from datetime import datetime

import requests
from sqlalchemy import text

from api.db import db
from api.auth import hash_password

import csv

@dataclass
class SocrataBusinessEntity:
    entityname: str
    principaladdress1: str
    principalcity: str
    principalstate: str
    principalzipcode: str
    principalcountry: str
    entityformdate: str

@dataclass
class CNPBusinessEntity:
    entityname: str
    principaladdress1: str
    entitywebsite: str
    entityemail: str
    entityPhone: str
    entityformdate: str
    entitytwitter: str
    entityfacebook: str
    entitylinkedin: str

DATE_FORMAT = '%Y-%m-%d'
# TODO: create a task that normalizes dates in database


@dataclass
class Lead:
    company_name: str
    company_address: str
    formation_date: datetime
    contact_name: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    twitter: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    last_email: Optional[datetime] = None
    last_google_search: Optional[datetime] = None
    last_twitter_search: Optional[datetime] = None
    last_facebook_search: Optional[datetime] = None
    last_linkedin_search: Optional[datetime] = None

    @property
    def formation_date_str(self):
        return self.formation_date.strftime(DATE_FORMAT)
    
def find_CNP_leads() -> int:
    inserted = 0
    entities = csv_to_entities('CNPData.csv')
    
    
    leads = (
        _map_CNP_entity_to_lead(entity)
        for entity in entities
    )
    
    with db.get_engine().begin() as connection:
        for lead in leads:
            connection.execute(text(
                """
                    INSERT INTO leads (
                        company_name,
                        company_address,
                        formation_date,
                        website,
                        phone,
                        email,
                        facebook,
                        data_source
                    )
                    SELECT
                        :company_name,
                        :company_address,
                        :formation_date,
                        :website,
                        :phone,
                        :email,
                        :facebook,
                        'ColoradoNonprofitAssociation'
                    WHERE NOT EXISTS (
                        SELECT 1 FROM leads
                        WHERE company_name = :company_name
                    )
                """),
                company_name=lead.company_name,
                company_address=lead.company_address,
                formation_date=lead.formation_date_str,
                website=lead.website,
                phone=lead.phone,
                email=lead.email,
                facebook=lead.facebook,
            )
            inserted += 1
    return inserted

def _map_CNP_entity_to_lead(entity: CNPBusinessEntity) -> Lead:
    return Lead(
        company_name=entity.entityname,
        company_address=entity.principaladdress1,
        website=entity.website,
        phone=entity.phone,
        email=entity.email,
        facebook=entity.facebook,
        formation_date=datetime.strptime(
            entity.entityformdate.split('T')[0], DATE_FORMAT),
    )

def csv_to_entities(file_name):
    
    with open(file_name) as csv_file:
        
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        business_entities = []
        for row in csv_reader:
            entity = CNP_row_to_dict(row)
            
            if line_count == 0: # skip csv column names
                line_count += 1
            else:
                temp_entity = CNPBusinessEntity()
                temp_entity.entityname=entity['entityname']
                temp_entity.principaladdress1=entity['principaladdress1']
                temp_entity.entitywebsite=entity['entitywebsite']
                temp_entity.entityemail=entity['entityemail']
                temp_entity.entityPhone=entity['entityPhone']
                temp_entity.entityformdate=entity['entityformdate']
                temp_entity.entitytwitter=entity['entitytwitter']
                temp_entity.entityfacebook=entity['entityfacebook']
                temp_entity.entitylinkedin=entity['entitylinkedin']
                business_entities.append(temp_entity)
                
        return business_entities

def CNP_row_to_dict(row):
    dict_row = {}
    dict_row['entityname'] = row[0]
    dict_row['entitywebsite'] = row[1]
    dict_row['entityemail'] = row[2]
    dict_row['entityPhone'] = row[3]
    dict_row['principaladdress1'] = row[4]
    dict_row['entityformdate'] = row[6]    
    dict_row['entitytwitter'] = row[8]
    dict_row['entityfacebook'] = row[9]
    dict_row['entitylinkedin'] = row[10]
    
    return dict_row

def find_socrata_api_leads(perpage=500, page=1) -> int:
    inserted = 0
    res = requests.get(
        _socrata_url(perpage, (page - 1) * perpage))
    if res.status_code != 200:
        print(f'Received response status code of {res.status_code}.')
        print(res.headers)
        print(res.json())
        return 0
    # TODO: catch request exceptions
    business_entities = (
        SocrataBusinessEntity(
            entityname=entity['entityname'],
            principaladdress1=entity['principaladdress1'],
            principalcity=entity['principalcity'],
            principalstate=entity['principalstate'],
            principalzipcode=entity['principalzipcode'],
            principalcountry=entity['principalcountry'],
            entityformdate=entity['entityformdate'],
        )
        for entity in res.json()
    )
    leads = (
        _map_socrata_entity_to_lead(entity)
        for entity in business_entities
    )
    with db.get_engine().begin() as connection:
        for lead in leads:
            connection.execute(text(
                """
                    INSERT INTO leads (
                        company_name,
                        company_address,
                        formation_date,
                        data_source
                    )
                    SELECT
                        :company_name,
                        :company_address,
                        :formation_date,
                        'socrata'
                    WHERE NOT EXISTS (
                        SELECT 1 FROM leads
                        WHERE company_name = :company_name
                    )
                """),
                company_name=lead.company_name,
                company_address=lead.company_address,
                formation_date=lead.formation_date_str,
            )
            inserted += 1
    return inserted


def _socrata_url(limit: int, offset: int):
    query_params = {
        'entitytype': 'Nonprofit Corporation',
        'principalcity': 'Denver',
        '$where': 'date_extract_y(entityformdate) > 2010',
        'entitystatus': 'Good Standing',
        '$limit': limit,
        '$offset': offset,
    }
    query_str = '&'.join(f"{k}={v}" for (k, v) in query_params.items())
    return f"https://data.colorado.gov/resource/4ykn-tg5h.json?{query_str}"


def _map_socrata_entity_to_lead(entity: SocrataBusinessEntity) -> Lead:
    # combine address fields into a single address
    address = entity.principaladdress1 + ', ' + entity.principalcity + " " + entity.principalstate + " " + entity.principalzipcode
    return Lead(
        company_name=entity.entityname,
        company_address=address,
        formation_date=datetime.strptime(
            entity.entityformdate.split('T')[0], DATE_FORMAT),
    )


def create_dev_users():
    q = text("""
        INSERT INTO users (username, password_hash, admin)
        VALUES
            ('user@gmail.com', :password, false),
            ('admin@gmail.com', :password, true)
    """)
    with db.get_connection() as conn:
        conn.execute(q, {'password': hash_password('password')})


def drop_dev_users():
    q = text("""
        DELETE FROM users
        WHERE username IN ('user@gmail.com', 'admin@gmail.com')
    """)
    with db.get_connection() as conn:
        conn.execute(q)