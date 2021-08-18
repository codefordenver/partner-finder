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

## Development
### Frontend
#### Accessing the api docs
The backend generates swagger documentation. This is a webpage that lets you make interactive api calls to test out the rest api before using it in your code. To run the swagger docs locally, make sure the `api` docker service is running. Check the api logs for a bearer token that you can use to authenticate on the swagger page. If you ran docker compose with the `-d` flag, you can get the logs with `docker compose logs api`.

Now look for bearer tokens that let you authenticate as a normal user and as an admin:
```
api_1       | [2021-08-11 01:05:47 +0000] [19] [INFO] To authenticate as user@gmail.com, include this header with the request:
api_1       |   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJAZ21haWwuY29tIiwiZXhwaXJlcyI6IjIwMjEtMDgtMTJUMDE6MDU6NDcuNTM0NDgzKzAwOjAwIiwiYWRtaW4iOmZhbHNlfQ.41xKVHDz0ONRiWx-fWqifVvDBSzCN6vPmmf4ZWV0H3g
api_1       | [2021-08-11 01:05:47 +0000] [19] [INFO] To authenticate as admin@gmail.com, include this header with the request:
api_1       |   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQGdtYWlsLmNvbSIsImV4cGlyZXMiOiIyMDIxLTA4LTEyVDAxOjA1OjQ3LjU2NTExNCswMDowMCIsImFkbWluIjp0cnVlfQ.NNUMN92roOU44DKXcnstBUK_vpRfg57RYJyBMCuSdmQ
```

Copy only the value of the header, that is, the part that looks like

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJAZ21haWwuY29tIiwiZXhwaXJlcyI6IjIwMjEtMDgtMTJUMDE6MDU6NDcuNTM0NDgzKzAwOjAwIiwiYWRtaW4iOmZhbHNlfQ.41xKVHDz0ONRiWx-fWqifVvDBSzCN6vPmmf4ZWV0H3g
```

Now in a web browser, navigate to http://localhost:8000/apidocs . You should see a page that looks like this:

![](./docs/swagger-page.png)

Click on the green "Authorize" button with the lock icon, paste the bearer token you copied into the login form, and click "Authorize".

![](./docs/swagger-login.png)

To send a request to any of the endpoints, click on one of the colored boxes, then click "Try it out" in the upper right corner. This lets you edit the request parameters and body through a form. You can send the request and view the response with the "Execute" button.

![](./docs/swagger-try-it.png)

### Backend
#### Linting and Formatting Scripts
We have github actions that will check that backend code is in the correct format and abides by PEP8 standards. You will need to run a formatter and a linter on your code before committing in order for your changes to be accepted. In the `backend/scripts`, directory, there are scripts called `lint.sh` and `format.sh` for doing this. You can run them directly from the `backend` directory:

```
cd backend
source venv/bin/activate
chmod +x scripts/*.sh
./scripts/format.sh
./scripts/lint.sh
```

After running `lint.sh`, you should see an output of `0` if everything is okay. Otherwise flake8 will output lines that need to be changed.


Once you've made formatting and linting changes, make a commit with a message like `lint and format` and add it to your PR. It is helpful to PR reviewers if you keep your formatting changes in their own commit because they can potentially make it harder to read your other code changes.


#### Connecting to the AWS Postgres instance
We run a postgres instance in AWS RDS. A simple method for connecting to the instance is with the psql command line tool. There is a script called `backend/database/psql.sh` that will run `psql` for you with arguments taken from environment variables. We will read these environment variables from a file called `.env-prod`. Please use this exact filename because it is already in `.gitignore`. Follow these steps to get into a psql session:

1. create a file called `backend/.env-prod` if it does not already exist
1. the contents of `backend/.env-prod` should look like this:
    ```
    export POSTGRES_PASSWORD=<insert password here>
    export POSGRES_DB=<insert db here>
    export POSTGRES_USER=<insert user here>
    export POSTGRES_HOST=<insert host here>
    ```
1. contact a project maintainer (galbwe) for the values of the environment variables above
1. source the environment variables to make them accessible in your terminal: `source backend/.env-prod`
1. Run the database connection script: `./backend/database/psql.sh`
1. You will be prompted for a password. It is the same as the `POSTGRES_PASSWORD` environment variable.
1. The prompt should change to show psql. You can now run some sql commands to check that the connection worked:
```sql
\dt  -- list tables
SELECT count(*) FROM leads;
SELECT * FROM leads LIMIT 5;
```
#### Postman Collection
Postman is a web client for testing out REST apis. See here to view and export [postman requests]() for this project. You will also need to install postman, import the collection, and then run the api on localhost to use postman in development.

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
