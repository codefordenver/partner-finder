import os
import hashlib

from flask import Flask, request
from flask_cors import CORS
from flask_login import LoginManager
from sqlalchemy import text

from .db import db


app = Flask(__name__)

app.secret_key = os.environ['SECRET_KEY']

# flask login
login_manager = LoginManager()
login_manager.init_app(app)


if os.environ.get('ALLOW_CORS', 'false').lower() == 'true':
    # for localhost development only
    CORS(app)


# TODO: return request metadata as part of responses


@app.route('/healthcheck')
def healthcheck():
    return "healthy", 200


@app.route('/leads', methods=['GET', 'POST'])
def leads_collection_view():
    if request.method == 'GET':
        return _get_all_leads(request)
    elif request.method == 'POST':
        # TODO: implement create method
        return _create_new_lead(request)
    return {
        "message": "Unknown http method",
    }, 404


# TODO: get these from a model
DEFAULT_LEAD_FIELDS = (
    'id',
    'company_name',
    'company_address',
    'formation_date',
    'contact_name',
    'website',
    'phone',
    'email',
    'twitter',
    'facebook',
    'linkedin',
    'last_email',
    'last_google_search',
    'last_twitter_search',
    'last_facebook_search',
    'last_linkedin_search',
)


MAX_PAGE_SIZE = 1000


def _get_all_leads(request):
    # TODO: refactor by splitting into helper functions
    # parse query params
    # TODO: add search parameter
    # TODO: add filters
    try:
        page, perpage = _parse_pagination_params(request)

        # removes fields with null values from the response
        drop_null = request.args.get('drop_null', 'false').lower() == 'true'
        include = request.args.get('include')
        if include is None:
            include = list(DEFAULT_LEAD_FIELDS)
        else:
            include = [
                field.lower().strip()
                for field in include.split(',')
                if field.lower() in DEFAULT_LEAD_FIELDS
            ]

    except ValueError as e:
        # TODO: log error message
        return {
            'message': 'invalid query parameters',
            'detail': {
                'error': str(e),
            }
        }, 400
    limit = perpage
    offset = (page - 1) * limit

    # TODO: handle database error
    # just grab all fields for now to avoid exposing query to sql injection
    with db.get_connection() as connection:
        res = connection.execute(
            text("""
                SELECT
                    {columns}
                FROM LEADS
                ORDER BY id
                LIMIT :limit
                OFFSET :offset;
            """.format(
                columns=','.join(DEFAULT_LEAD_FIELDS)
            )),
            limit=limit,
            offset=offset,
        )
        response_body = []
        count = 0
        for row in res:
            # TODO: handle potential errors if the user chooses a field not in the row
            lead = {
                field: getattr(row, field)
                for field in include
            }
            if drop_null:
                lead = {
                    k: v for (k, v) in lead.items() if v is not None
                }
            response_body.append(
                lead
            )
            count += 1
        return {
            'count': count,
            'query': {
                'page': page,
                'perpage': perpage,
            },
            'leads': response_body
        }, 200


def _parse_pagingation_params(request):
    page = int(request.args.get('page', 1))
    if page < 1:
        raise ValueError('Page parameter must be positive.')
    if page > MAX_PAGE_SIZE:
        raise ValueError('Page size exceeded maximum.')
    perpage = int(request.args.get('perpage', 100))
    return page, perpage


def _create_new_lead(request):
    # parse body params
    body = {
        field: value
        for (field, value) in request.get_json().items()
        if field != 'id' and field in DEFAULT_LEAD_FIELDS and value is not None
    }
    # insert into leads table
    # TODO: handle database error
    with db.get_engine().begin() as connection:
        row = connection.execute(
            text("""
                INSERT INTO leads ({columns})
                VALUES ({placeholders})
                RETURNING *;
                """.format(
                    columns=','.join(body.keys()),
                    placeholders=','.join(f':{column}' for column in body.keys()),
            )),
            **body,
        ).first()
    return {
        field: getattr(row, field)
        for field in DEFAULT_LEAD_FIELDS
    }


@app.route('/leads/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def lead_view(id):
    if request.method == 'GET':
        return _get_lead_by_id(id)
    elif request.method == 'PUT':
        return _modify_lead_with_id(id, request)
    elif request.method == 'DELETE':
        return _delete_lead_with_id(id)
    return {
        "message": "Unknown http method"
    }, 404


def _get_lead_by_id(id: int):
    # TODO: add include parameter for filtering on columns
    with db.get_connection() as connection:
        row = connection.execute(
            text("""
                SELECT {columns} FROM leads
                WHERE id = :id
            """.format(
                columns=','.join(DEFAULT_LEAD_FIELDS)
            )),
            id=id,
        ).first()
    if row is None:
        return {
            "params": {
                "id": id,
            },
            "message": "Could not find lead with given id."
        }, 404
    return {
        field: getattr(row, field)
        for field in DEFAULT_LEAD_FIELDS
    }, 200


def _modify_lead_with_id(id: int, request):
    body = {
        field: value
        for (field, value) in request.get_json().items()
        if field != 'id' and field in DEFAULT_LEAD_FIELDS
    }
    with db.get_engine().begin() as connection:
        row = connection.execute(
            text("""
                UPDATE leads
                SET {updates}
                WHERE id = :id
                RETURNING *;
            """.format(
                updates=",".join(f"{field}=:{field}" for field in body.keys())
            )),
            id=id,
            **body,
        ).first()

    if row is None:
        return {
            "params": {
                "id": id,
            },
            "body": request.get_json(),
            "message": "Could not find lead with given id."
        }, 404

    return {
        field: getattr(row, field)
        for field in DEFAULT_LEAD_FIELDS
    }, 200


def _delete_lead_with_id(id: int):
    with db.get_engine().begin() as connection:
        row = connection.execute(
            text("""
                DELETE FROM leads
                WHERE id = :id
                RETURNING *;
            """),
            id=id,
        ).first()

    if row is None:
        return {
            "params": {
                "id": id,
            },
            "message": "Could not find lead with given id."
        }, 404

    return {
        field: getattr(row, field)
        for field in DEFAULT_LEAD_FIELDS
    }


@app.route('/users', methods=['GET', 'POST'])
def user_collection_view():
    if request.method == 'GET':
        return _get_all_users(request)
    elif request.method == 'POST':
        return _create_user(request)


def _get_all_users(request):
    page, perpage = _parse_pagingation_params(request)
    query = text("""
        SELECT * FROM users
        LIMIT :limit
        OFFSET :offset
    """)
    query_params = {
        'limit': perpage,
        'offset': (page - 1) * perpage,
    }
    with db.get_connection() as conn:
        res = conn.execute(query, query_params)
        users = [
            dict(zip(res.keys(), row))
            for row in res
        ]
        return {
            'pagination': {
                'page': page,
                'perpage': perpage,
            },
            'users': users
        }


def _create_user(request):
    username, password = request.json.get('username'), request.json.get('password')
    for field, name in [(username, 'username'), (password, 'password')]:
        if field is None:
            return {
                'message': f'missing required field {name!r}'
            }, 400
    password_hash, salt = _hash_password(password)
    query = text("""
        INSERT INTO users (username, password_hash, salt)
        VALUES (:username, :password_hash, :salt)
        RETURNING username, password_hash, salt
    """)
    query_params = {
        'username': username,
        'password_hash': password_hash,
        'salt': salt,
    }
    with db.get_connection() as conn:
        res = conn.execute(query, query_params)
        return dict(zip(res.keys(), res.first()))


def _generate_salt():
    return os.urandom(32)


def _hash_password(password, salt=None):
    if salt is None:
        salt = _generate_salt()
    password_hash = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000,
    )
    return password_hash, salt


@app.route('/users/<username>', methods=['GET', 'PUT', 'DELETE'])
def single_user_view(username):
    if request.method == 'GET':
        return _get_user_by_username(username)
    elif request.method == 'PUT':
        return _update_user(username, request)
    elif request.method == 'DELETE':
        return _delete_user_by_username(username)


def _get_user_by_username(username):
    query = text("""
        SELECT * FROM users
        WHERE username = :username
    """)
    query_params = {
        "username": username,
    }
    with db.get_connection() as conn:
        res = conn.execute(query, query_params)
        return dict(zip(res.keys(), res.first()))


def _update_user(username, request):
    password = request.json.get('password')
    if password is None:
        return {
            'message': f'missing required field "password"'
        }, 400
    password_hash, salt = _hash_password(password)
    updates = {
        'password_hash': password_hash,
        'salt': salt,
    }
    query = text("""
        UPDATE users
        SET {updates}
        WHERE username = :username
        RETURNING *
    """.format(
        updates=', '.join(f'{k} = :{k}' for k in updates)
    ))
    query_params = {
        'username': username,
        **updates,
    }
    with db.get_connection() as conn:
        res = conn.execute(query, query_params)
        return dict(zip(res.keys(), res.first()))


def _delete_user_by_username(username):
    query = text("""
        DELETE FROM users
        WHERE username = :username
        RETURNING *
    """)
    query_params = {
        "username": username,
    }
    with db.get_connection() as conn:
        res = conn.execute(query, query_params)
        return dict(zip(res.keys(), res.first()))
