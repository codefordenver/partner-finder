from typing import Optional
from dataclasses import dataclass
from datetime import datetime

import requests
from sqlalchemy import text

from api.db import db
from api.auth import hash_password

import csv
import os


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
    entityphone: str
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
    path_to_csv = os.path.abspath(os.path.join(
        os.path.dirname(__file__),
        os.pardir,
        'database',
        'CNPData_New.csv',
        ))

    entities = csv_to_entities(path_to_csv)

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
                        'colorado_nonprofit_association'
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
    correct_date = None
    if (check_founded_year(entity.entityformdate)):
        correct_date = datetime.strptime(
            entity.entityformdate, '%Y')
    else:
        correct_date = correct_date = datetime.strptime(
            '1000', '%Y')

    return Lead(
        company_name=entity.entityname,
        company_address=entity.principaladdress1,
        website=entity.entitywebsite,
        phone=entity.entityphone,
        email=entity.entityemail,
        facebook=entity.entityfacebook,
        formation_date=correct_date
        )


def check_founded_year(year):
    if year == '':
        return None
    else:
        return year


def csv_to_entities(file_name: str):

    with open(file_name) as csv_file:

        csv_reader = csv.DictReader(csv_file)
        business_entities = []

        for row in csv_reader:
            temp_entity = CNPBusinessEntity(
                entityname=row['name'],
                principaladdress1=row['address'],
                entitywebsite=row['website'],
                entityemail=row['email'],
                entityphone=row['phone'],
                entityformdate=row['year_founded'],
                entitytwitter=row['twitter'],
                entityfacebook=row['facebook'],
                entitylinkedin=row['linkedin'],
            )
            business_entities.append(temp_entity)

        return business_entities


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
