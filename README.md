A micro-CRM to help Code For Denver discover leads and manage its outreach to potential partners.

# Data Sources For Leads
- [Socrata API](https://data.colorado.gov/Business/Business-Entities-in-Colorado/4ykn-tg5h)
    - Dataset with registered business entities in Colorado. It can be filtered to return only nonprofits.
- [Colorado Nonprofit Association](https://coloradononprofits.org/membership/nonprofit-member-directory)
    - Website with nonprofit members registered with Colorado Nonprofit Association.
- Twitter?
- LinkedIn?


# Getting Started
## Get the Code
1. Go to the project's [github page](https://github.com/codefordenver/partner-finder).
1. Find the green "Code" button
1. Click the clipboard icon to copy a link to the git repo.
    ![](./docs/github-code-button.png)
1. In a terminal, navigate to the directory where you want to create the project folder and clone the repo:
    ```bash
    git clone <git-repo-name>
    ```
## Running the app locally
1. Install Docker and Docker-compose
1. Install node
1. Install node dependencies:
    - `cd` to `frontend/cfd-partner-finder-frontend`
    - `npm i --save`
    - `cd ../..`
1. Run the frontend, rest api, and database in docker containers:
    ```bash
    docker-compose up --build -d
    ```
1. Check the containers are running
    ```bash
    docker ps
    ```
    - you should see something like
        ![](./docs/docker-ps-output.png)
1. Try connecting to the database with psql:
    ```bash
    docker exec -it partner-finder_postgres_1 psql -U cfd_partner_finder
    select * from leads limit 5;
    ```
    to exit psql, type `\q`
1. Check that the api works with curl:
    - try the healthcheck endpoint: `curl http://localhost:8000/healthcheck`
    - get an access token to use other api endpoints:
        ```bash
        curl --location --request POST 'http://localhost:8000/login' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "username": "admin",
            "password": "password"
        }'
        ```
    - get a list of leads:
        ```bash
        curl --location --request GET 'http://localhost:8000/leads' \
        --header 'Authorization: Bearer <insert your token here>'
        ```
1. Check that the frontend is working:
    - In a browser, go to http://localhost:3000
    - You should see a login page. Use these credentials to continue to the homepage:
        - username: `user@gmail.com`
        - password: `password`


## Creating Database Migration Files
You'll need a python virtual environment in the `backend` directory. Make sure you have python 3.7 or up installed. Ideally 3.9 since that is what is used in the rest api. You can check the version with `python --version`

Change into the backend directory then do `python -m venv venv`. This should create a `venv` directory.

Next you'll want to activate the virtual environment with `source venv/bin/activate`.

Then install requirements with `pip install -r requirements.txt`

You should also need to set some environment variables so alembic can send queries to the locally running database. Create a `.env` file with `touch .env`, then add these lines to it:

```
export FLASK_APP=api/app:dev_app
export FLASK_ENV=development
export POSTGRES_PASSWORD=password
export POSTGRES_USER=cfd_partner_finder
export POSTGRES_DB=cfd_partner_finder
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export ALLOW_CORS=true
export SECRET_KEY=supersafe
export PYTHONPATH="${pwd}"
```

Now source the environment variables: `source .env`

Finally, you can create a new migration by doing `alembic revision -m "<description of migration>"`. This should create a new file under the `versions` directory.

## Running a data analysis jupyter notebook (Optional)
1. Make sure python 3 is installed on your system
1. from the project root directory, change to the data analysis directory
    - `cd ./data_analysis`
1. Create a virtual environment
    ```python
    python3 -m venv --prompt data_analysis venv
    ```
    - You should see a newly created folder called `venv`
1. Activate the virtual environment
    ```bash
    source venv/bin/activate
    ```
    - Your terminal prompt should change to display `(data_analysis)` on the left while the virtual environment is active.
1. Upgrade the virtual environment's installation of pip
    - `pip install --upgrade pip`
1. Install dependencies
    - `pip install -r requirements.txt`
1. Run a jupyter server:
    ```
    jupyter notebook
    ```
1. You should see a file system open in a web browser. If not, go to http://localhost:8888/tree
    ![](./docs/jupyter-notebook.png)
1. Click on `notebooks`, and then `businesses.ipynb`. You should now see a notebook
    ![](./docs/jpyter-notebook-2.png)
1. When you are done, stop the jupyter server with `Ctrl+C` and deactivate the virtual environment with `deactivate`.
