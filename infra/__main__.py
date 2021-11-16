"""An AWS Python Pulumi program"""

import pulumi
import pulumi_random as random

from resources.network import Vpc, VpcArgs
from resources.database import Db, DbArgs


# Get config data
config = pulumi.Config()
service_name = config.get("service_name") or "partner-finder"
db_name = config.get("db_name") or "partner_finder"
db_user = config.get("db_user") or "postgres"

# Get secretified password from config and protect it going forward, or create one using the 'random' provider.
db_password = config.get_secret("db_password")
if not db_password:
    password = random.RandomPassword(
        "db_password",
        length=16,
        special=True,
        override_special="_%@",
    )
    # Pulumi knows this provider is used to create a password and thus automatically protects it going forward.
    db_password = password.result

# Create an AWS VPC and subnets, etc
network = Vpc(f"{service_name}-net", VpcArgs())
subnet_ids = []
for subnet in network.subnets:
    subnet_ids.append(subnet.id)

# Create a backend DB instance
be = Db(
    f"{service_name}-be",
    DbArgs(
        db_name=db_name,
        db_user=db_user,
        db_password=db_password,
        # publicly_accessible=True,  # Uncomment this to override for testing
        subnet_ids=subnet_ids,
        security_group_ids=[network.rds_security_group.id],
    ),
)


pulumi.export("DB Endpoint", be.db.address)
pulumi.export("DB User Name", be.db.username)
pulumi.export("DB Password", be.db.password)
