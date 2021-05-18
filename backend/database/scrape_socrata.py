import click

from tasks import find_socrata_api_leads


@click.command()
@click.option('--perpage', default=500)
@click.option('--pages', default=5)
def scrape_socrata(perpage, pages):
    perpage = int(perpage)
    pages = int(pages)
    for page in range(pages):
        print(f'scraping page {page + 1} of {pages}')
        find_socrata_api_leads(perpage, page + 1)


if __name__ == '__main__':
    scrape_socrata()