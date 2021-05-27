-- RUN AS SUPERUSER TO SET UP NEW APPLICATION AND STAGING DATABASES

ALTER DATABASE cfd_partner_finder OWNER TO cfd_partner_finder;
\c cfd_partner_finder
CREATE SCHEMA api;
CREATE SCHEMA staging;
GRANT ALL PRIVILEGES ON SCHEMA api to cfd_partner_finder;
GRANT ALL PRIVILEGES ON DATABASE cfd_partner_finder to cfd_partner_finder;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA api to cfd_partner_finder;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA api to cfd_partner_finder;
ALTER ROLE cfd_partner_finder SET search_path TO api, public;

CREATE DATABASE cfd_partner_finder_test;

ALTER DATABASE cfd_partner_finder_test OWNER TO cfd_partner_finder;
\c cfd_partner_finder_test
CREATE SCHEMA api;
CREATE SCHEMA staging;
GRANT ALL PRIVILEGES ON SCHEMA api to cfd_partner_finder;
GRANT ALL PRIVILEGES ON DATABASE cfd_partner_finder to cfd_partner_finder;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA api to cfd_partner_finder;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA api to cfd_partner_finder;
ALTER ROLE cfd_partner_finder SET search_path TO api, public;
