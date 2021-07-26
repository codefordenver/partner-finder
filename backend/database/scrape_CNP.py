import click

from tasks import find_CNP_leads


@click.command()
def scrape_CNP():
    find_CNP_leads()


if __name__ == '__main__':
    scrape_CNP()
