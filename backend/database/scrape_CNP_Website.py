import requests
from bs4 import BeautifulSoup as bs
import pandas as pd
import time
import sys


# queries CNP member dierectory page, for the page and region selected
# (defaults to page 1 and denver)

def query_cnp_page(pageNum=1, regionNum=6):
    url = (
        f"https://coloradononprofits.org/membership/nonprofit-member-directory"
        f"?combine=&colorado_region_{regionNum}%5B0%5D=13&page={pageNum}"
    )
#     return url
    return requests.get(url)


# Gets all the member urls from the directory page supplied

def mem_urls_from_page(page):
    soup = bs(page.content, 'html.parser')
    pages_found = soup.findAll('a', class_='member-type-1')
    url_list = []
    for href in pages_found:
        url_list.append(href['href'])
    return url_list


# queries the CNP member page.

def query_mem_page(pageHref='membership/nonprofit-member-directory/nonprofit/1'):
    url = 'https://coloradononprofits.org/' + pageHref
    return requests.get(url)


def socials_from_soup(socials, classes):
    if socials is None:
        return{}
    return {
        c: socials.find(class_=c).text
        for c in classes
        if socials.find(class_=c)
    }


def get_valid_data(maybe_list):
    if len(maybe_list) > 0:
        return maybe_list[0]
    return None


def get_text(dataFound):
    if dataFound is None:
        return None
    return dataFound.find('span', class_='field-content').text


# get useful data from the member page.

def analyze_mem_page(mem_page):
    usefulData = {}
    soup = bs(mem_page.content, 'html.parser')

    name = soup.find('h1')
    usefulData['name'] = name.text

    website = get_valid_data(soup.findAll('div', class_='views-field views-field-url'))
    usefulData['website'] = get_text(website)

    email = get_valid_data(soup.findAll('div', class_='views-field views-field-email'))
    deobfuscate_cf_email(email)
    usefulData['email'] = get_text(email)

    phone = get_valid_data(soup.findAll('div', class_='views-field views-field-phone'))
    usefulData['phone'] = get_text(phone)

    address = get_valid_data(soup.findAll('div', class_='views-field views-field-postal-code'))
    usefulData['address'] = get_text(address)

    mission_statement = get_valid_data(soup.findAll('div', class_='views-field views-field-mission-statement-9'))
    usefulData['mission_statement'] = get_text(mission_statement)

    year_founded = get_valid_data(soup.findAll('div', class_='views-field views-field-year-founded-10'))
    usefulData['year_founded'] = get_text(year_founded)

    popu_served = get_valid_data(soup.findAll('div', class_='views-field views-field-populations-served-16'))
    usefulData['popu_served'] = get_text(popu_served)

    socials = soup.find('div', class_='views-field views-field-nothing-1')
    socials_dict = socials_from_soup(socials, ['facebook', 'linkedin', 'twitter', 'instagram'])
    usefulData['twitter'] = socials_dict.get('twitter')
    usefulData['facebook'] = socials_dict.get('facebook')
    usefulData['linkedin'] = socials_dict.get('linkedin')
    usefulData['instagram'] = socials_dict.get('instagram')

    programs = soup.find('div', class_='views-field views-field-programs-15')
    usefulData['programs'] = get_text(programs)

    county = soup.find('div', class_='views-field views-field-county')
    usefulData['county'] = get_text(county)

    return usefulData


# turn to data to csv

def mem_data_to_csv(mem_data):
    import os
    # if file does not exist write header
    df = pd.DataFrame(mem_data)
    if not os.path.isfile('CNPData.csv'):
        df.to_csv('CNPData.csv', header='column_names')
    else:  # else it exists so append without writing the header
        df.to_csv('CNPData.csv', mode='a', header=False)
#     df = pd.DataFrame(mem_data)
#     df.to_csv ('CNPData.csv', index = False,header=True)


# https://stackoverflow.com/questions/44264658/beautifulsoup-4-spans-containg-return-strange-results
def decode(cfemail):
    enc = bytes.fromhex(cfemail)
    return bytes([c ^ enc[0] for c in enc[1:]]).decode('utf8')


def deobfuscate_cf_email(soup):
    if soup:
        for encrypted_email in soup.select('span.__cf_email__'):
            decrypted = decode(encrypted_email['data-cfemail'])
            encrypted_email.replace_with(decrypted)


# @click.command()
def scrape_full_website(startPage=1, endPage=43):
    # There were 42 pages. I split them up, probably too much.
    # (1,6)->(6,12) ... -> (42,43)
    mem_data = []
    for x in range(startPage, endPage):
        page = query_cnp_page(x)
        member_urls = mem_urls_from_page(page)
        sleeptime = 3
        for url in member_urls:
            mem_page = query_mem_page(url)
            mem_data.append(analyze_mem_page(mem_page))
            time.sleep(sleeptime)
    return mem_data


# Can be run with arguments to specify the range of pages to be covered.
if __name__ == "__main__":
    if len(sys.argv) >= 2:
        startPage = int(sys.argv[1])
        endPage = int(sys.argv[2])
        mem_data_to_csv(scrape_full_website(startPage, endPage))
    else:
        mem_data_to_csv(scrape_full_website())
