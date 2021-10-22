from flask import Blueprint, request

import sqlalchemy.exc as sa_exc
from sqlalchemy import text

from ..auth import auth
from ..db import db
from ..pagination import parse_pagination_params


leads_bp = Blueprint("leads", __name__)


@leads_bp.route("/leads", methods=["GET", "POST"])
@auth("user")
def leads_collection_view():
    if request.method == "GET":
        return _get_all_leads(request)
    elif request.method == "POST":
        # TODO: implement create method
        return _create_new_lead(request)
    return {
        "message": "Unknown http method",
    }, 404


# TODO: get these from a model
# TODO: allow filtering on fields
DEFAULT_LEAD_FIELDS = (
    "id",
    "company_name",
    "company_address",
    "formation_date",
    "contact_name",
    "website",
    "phone",
    "email",
    "twitter",
    "facebook",
    "linkedin",
    "last_email",
    "last_google_search",
    "last_twitter_search",
    "last_facebook_search",
    "last_linkedin_search",
    "instagram",
    "mission_statement",
    "programs",
    "populations_served",
    "county",
    "colorado_region",
    "data_source",
    "assigned",
)


def _get_all_leads(request):
    # TODO: refactor by splitting into helper functions
    # parse query params
    # TODO: add filters
    try:
        page, perpage = parse_pagination_params(request)
        search = _parse_search_param(request)
        tag = _parse_tag_param(request)

        # removes fields with null values from the response
        drop_null = request.args.get("drop_null", "false").lower() == "true"
        include = request.args.get("include")
        if include is None:
            include = list(DEFAULT_LEAD_FIELDS)
        else:
            include = [field.lower().strip() for field in include.split(",") if field.lower() in DEFAULT_LEAD_FIELDS]

    except ValueError as e:
        # TODO: log error message
        return {
            "message": "invalid query parameters",
            "detail": {
                "error": str(e),
            },
        }, 400
    limit = perpage
    offset = (page - 1) * limit

    # get an id for the given tag
    select_id_for_tag = text(
        """
        SELECT
            id
        FROM tags
        WHERE tag = :tag
        """
    )
    with db.get_connection() as conn:
        row = conn.execute(select_id_for_tag, tag=tag).first()
        tag_id = row[0] if row else None
        if tag is not None and tag_id is None:
            return {
                "count": 0,
                "leads": [],
            }, 200

    if search is None and tag_id is None:
        query = text(
            """
            SELECT
                {columns}
            FROM leads
            ORDER BY id
            LIMIT :limit
            OFFSET :offset;
        """.format(
                columns=",".join(DEFAULT_LEAD_FIELDS)
            )
        )
        query_args = {
            "limit": limit,
            "offset": offset,
        }
    elif search is None:
        query = text(
            """
            SELECT
                {columns}
            FROM lead_tag lt
            JOIN leads l on l.id = lt.lead_id
            JOIN tags t on t.id = lt.tag_id
            WHERE lt.tag_id = :tag_id
            """.format(
                columns=",".join("l." + f for f in DEFAULT_LEAD_FIELDS)
            ),
        )
        query_args = {
            "tag_id": tag_id,
        }
    elif tag_id is None:
        query = text(
            """
            SELECT
                {columns}
            FROM leads
            WHERE to_tsvector(company_name) @@ to_tsquery(:search)
            ORDER BY ts_rank(to_tsvector(company_name), :search)
            LIMIT :limit
            OFFSET :offset
        """.format(
                columns=",".join(DEFAULT_LEAD_FIELDS),
            )
        )
        query_args = {
            "limit": limit,
            "offset": offset,
            "search": search,
        }
    else:
        query = text(
            """
            SELECT
                {columns}
            FROM lead_tag lt
            JOIN leads l on l.id = lt.lead_id
            JOIN tags t on t.id = lt.tag_id
            WHERE to_tsvector(l.company_name) @@ to_tsquery(:search)
                AND lt.tag_id = :tag_id
            ORDER BY ts_rank(to_tsvector(company_name), :search)
            LIMIT :limit
            OFFSET :offset
        """.format(
                columns=",".join("l." + f for f in DEFAULT_LEAD_FIELDS),
            )
        )
        query_args = {
            "limit": limit,
            "offset": offset,
            "tag_id": tag_id,
            "search": search,
        }

    # TODO: handle database error
    # just grab all fields for now to avoid exposing query to sql injection
    with db.get_connection() as connection:
        res = connection.execute(query, **query_args)
        leads = []
        count = 0
        for row in res:
            # TODO: handle potential errors if the user chooses a field not in the row
            lead = {field: getattr(row, field) for field in include}
            if drop_null:
                lead = {k: v for (k, v) in lead.items() if v is not None}
            leads.append(lead)
            count += 1
        leads_with_tags = _get_tags(leads)
        return {
            "count": count,
            "query": {
                "page": page,
                "perpage": perpage,
            },
            "leads": leads_with_tags,
        }, 200


def _get_tags(leads):
    with db.get_engine().connect() as conn:
        res = conn.execute(
            text(
                """
                SELECT lt.lead_id, t.id as tag_id, t.tag FROM
                lead_tag lt
                JOIN tags t
                ON lt.tag_id = t.id
                WHERE lt.lead_id = lead_id;
            """
            ),
        )
        lead_tags = [dict(row) for row in res]
        for lead in leads:
            lead["tags"] = _get_tags_for_lead(lead["id"], lead_tags)
        return leads


def _get_tags_for_lead(lead_id, lead_tags):
    return [
        {"id": lead_tag["tag_id"], "tag": lead_tag["tag"]} for lead_tag in lead_tags if lead_tag["lead_id"] == lead_id
    ]


@leads_bp.route("/leads/n_pages", methods=["GET"])
@auth("user")
def leads_number_of_pages():
    """
    Determines the number of pages needed to show all paginated results
    """
    try:
        search = _parse_search_param(request)
        tag = _parse_tag_param(request)
        _, perpage = parse_pagination_params(request)
    except ValueError as e:
        # TODO: log error message
        return {
            "message": "invalid query parameters",
            "detail": {
                "error": str(e),
            },
        }, 400

    # get an id for the given tag
    select_id_for_tag = text(
        """
        SELECT
            id
        FROM tags
        WHERE tag = :tag
        """
    )
    with db.get_connection() as conn:
        row = conn.execute(select_id_for_tag, tag=tag).first()
        tag_id = row[0] if row else None

    if search is None and tag_id is None:
        query = text(
            """
            SELECT count(id) as n_records
            FROM leads;
            """
        )
        query_args = {}
    elif search is None:
        query = text(
            """
            SELECT count(l.id) as n_records
            FROM leads l
            INNER JOIN lead_tag lt on l.id = lt.lead_id
            WHERE lt.tag_id = :tag_id
            """
        )
        query_args = {
            "tag_id": tag_id,
        }
    elif tag_id is None:
        query = text(
            """
            SELECT count(id) AS n_records
            FROM leads
            WHERE to_tsvector(company_name) @@ to_tsquery(:search)
            """
        )
        query_args = {"search": search}
    else:
        query = text(
            """
            SELECT count(l.id) AS n_records
            FROM lead_tag lt
            JOIN leads l on l.id = lt.lead_id
            JOIN tags t on t.id = lt.tag_id
            WHERE to_tsvector(l.company_name) @@ to_tsquery(:search)
                AND lt.tag_id = :tag_id
            """
        )
        query_args = {
            "tag_id": tag_id,
            "search": search,
        }

    with db.get_connection() as connection:
        row = connection.execute(query, **query_args).fetchone()
        n_records = row["n_records"]
        pages = n_records // perpage
        if n_records % perpage != 0:
            pages += 1
        return {
            "query": {
                "search": search,
                "tag": tag,
                "perpage": perpage,
            },
            "pages": pages,
        }, 200


def _parse_search_param(request):

    return request.args.get("search")


def _parse_tag_param(request):

    return request.args.get("tag")


VALID_DATA_SOURCES = (
    "socrata",
    "colorado_nonprofit_association",
    "user_entry",
)


def _create_new_lead(request, valid_data_sources=VALID_DATA_SOURCES):
    # parse body params
    body = {
        field: value
        for (field, value) in request.get_json().items()
        if field != "id" and field in DEFAULT_LEAD_FIELDS and value is not None
    }

    # get input company_name
    company_name = body.get("company_name")

    # check company_name is not None
    if not company_name:
        return {"message": "company_name cannot be blank"}, 400
    else:
        # remove leading and trailing spaces
        company_name = company_name.strip()

        # check company_name is not None post-strip
        if not company_name:
            return {"message": "company_name cannot be blank"}, 400
        else:
            # check if company_name only contains alphanumeric characters or middle spaces
            if not all(c.isalnum() or c.isspace() or c == "." or c == "&" or c == "'" for c in company_name):
                return {"message": "company_name can only contain a-z, 0-9, ., &, ', whitespace"}, 400

    # validate data source field
    data_source = body.get("data_source")
    if data_source:
        data_source = str(data_source).lower()
        if data_source not in valid_data_sources:
            return {"message": f'Invalid value for the "data_source" parameter: {data_source!r}'}, 422

    # insert into leads table
    # TODO: handle database error
    with db.get_engine().begin() as connection:
        row = connection.execute(
            text(
                """
                INSERT INTO leads ({columns})
                VALUES ({placeholders})
                RETURNING *;
                """.format(
                    columns=",".join(body.keys()),
                    placeholders=",".join(f":{column}" for column in body.keys()),
                )
            ),
            **body,
        ).first()
    return {field: getattr(row, field) for field in DEFAULT_LEAD_FIELDS}


@leads_bp.route("/leads/<int:id>", methods=["GET", "PUT", "DELETE"])
@auth("user")
def lead_view(id):
    if request.method == "GET":
        return _get_lead_by_id(id)
    elif request.method == "PUT":
        return _modify_lead_with_id(id, request)
    elif request.method == "DELETE":
        return _delete_lead_with_id(id)
    return {"message": "Unknown http method"}, 404


def _get_lead_by_id(id: int):
    # TODO: add include parameter for filtering on columns
    with db.get_connection() as connection:
        row = connection.execute(
            text(
                """
                SELECT {columns} FROM leads
                WHERE id = :id
            """.format(
                    columns=",".join(DEFAULT_LEAD_FIELDS)
                )
            ),
            id=id,
        ).first()
    if row is None:
        return {
            "params": {
                "id": id,
            },
            "message": "Could not find lead with given id.",
        }, 404
    return {field: getattr(row, field) for field in DEFAULT_LEAD_FIELDS}, 200


def _modify_lead_with_id(id: int, request):
    body = {
        field: value for (field, value) in request.get_json().items() if field != "id" and field in DEFAULT_LEAD_FIELDS
    }
    with db.get_engine().begin() as connection:
        row = connection.execute(
            text(
                """
                UPDATE leads
                SET {updates}
                WHERE id = :id
                RETURNING *;
            """.format(
                    updates=",".join(f"{field}=:{field}" for field in body.keys())
                )
            ),
            id=id,
            **body,
        ).first()

    if row is None:
        return {
            "params": {
                "id": id,
            },
            "body": request.get_json(),
            "message": "Could not find lead with given id.",
        }, 404

    return {field: getattr(row, field) for field in DEFAULT_LEAD_FIELDS}, 200


def _delete_lead_with_id(id: int):
    with db.get_engine().begin() as connection:
        row = connection.execute(
            text(
                """
                DELETE FROM leads
                WHERE id = :id
                RETURNING *;
            """
            ),
            id=id,
        ).first()

    if row is None:
        return {
            "params": {
                "id": id,
            },
            "message": "Could not find lead with given id.",
        }, 404

    return {field: getattr(row, field) for field in DEFAULT_LEAD_FIELDS}


@leads_bp.route("/leads/<int:id>/tags", methods=["GET", "POST"])
@auth("user")
def lead_tags_view(id):
    if request.method == "GET":
        return _get_all_tags_for_lead(id)
    elif request.method == "POST":
        return _add_tag_to_lead(id, request)


def _get_all_tags_for_lead(lead_id):
    with db.get_engine().connect() as conn:
        res = conn.execute(
            text(
                """
                SELECT t.* FROM
                lead_tag lt
                JOIN tags t
                ON lt.tag_id = t.id
                WHERE lt.lead_id = :lead_id
            """
            ),
            lead_id=lead_id,
        )
        tags = [dict(row) for row in res]
    return {
        "lead_id": lead_id,
        "tags": tags,
    }, 200


def _add_tag_to_lead(lead_id, request):
    tag_id = request.get_json().get("tag_id")
    if tag_id is None:
        return {"message": "Missing body parameter 'tag'"}, 400
    with db.get_engine().begin() as conn:
        # check if a tag with that name exists
        tag_id_row = conn.execute(
            text(
                """
                SELECT id FROM tags
                WHERE id = :tag_id
            """
            ),
            tag_id=tag_id,
        ).first()
        if tag_id_row is None:
            return {"message": f"Could not find a tag with id {tag_id!r}"}, 400
        tag_id = tuple(tag_id_row)[0]
        # insert record into association table for leads and tags
        try:
            row = conn.execute(
                text(
                    """
                    INSERT INTO lead_tag
                    (lead_id, tag_id)
                    VALUES
                    (:lead_id, :tag_id)
                    RETURNING *;
                """
                ),
                lead_id=lead_id,
                tag_id=tag_id,
            ).first()
        except sa_exc.IntegrityError as e:
            if str(e).startswith("(psycopg2.errors.UniqueViolation)"):
                return {
                    "message": f"lead with id {lead_id} already has a tag with id {tag_id}",
                }
        return dict(row), 200


@leads_bp.route("/leads/<int:lead_id>/tags/<int:tag_id>", methods=["DELETE"])
@auth("user")
def lead_tag_with_id_view(lead_id, tag_id):
    if request.method == "DELETE":
        return _remove_tag_from_lead(lead_id, tag_id)
    return {"message": "Unknown http method"}, 404


def _remove_tag_from_lead(lead_id, tag_id):
    with db.get_engine().begin() as conn:
        row = conn.execute(
            text(
                """
                DELETE FROM lead_tag
                WHERE
                    lead_id = :lead_id
                    AND tag_id = :tag_id
                RETURNING *;
            """
            ),
            lead_id=lead_id,
            tag_id=tag_id,
        ).first()
        if row is None:
            return {"message": f"Could not find tag with id {tag_id} for lead with id {lead_id}"}, 400
        return dict(row), 200
