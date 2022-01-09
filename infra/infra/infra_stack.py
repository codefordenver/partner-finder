from aws_cdk import (
    # Duration,
    Stack,
    # aws_sqs as sqs,
    aws_ec2 as ec2,
)
from constructs import Construct

class InfraStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)
        vpc = self._setup_vpc()
        ec2_instance = self._setup_ec2_instance(vpc)

        # TODO: create rds instance
        rds_instance = self._setup_rds_instance(vpc)

    def _setup_vpc(self):

        # TODO: determine cidr block
        vpc = ec2.Vpc(
            self,
            "VPC",
            cidr="10.0.0.0/16"
        )

        # TODO: configure public access

        # Iterate the private subnets
        selection = vpc.select_subnets(
            subnet_type=ec2.SubnetType.PRIVATE_WITH_NAT
        )

        for subnet in selection.subnets:
            pass

        return vpc

    def _setup_ec2_instance(self, vpc):
        # define instance type
        instance_type = ec2.InstanceType("t3.micro")
        # define machine image
        machine_image = ec2.MachineImage.latest_amazon_linux()

        # create ec2 instance
        ec2_instance = ec2.Instance(self, "Instance",
            vpc=vpc,
            instance_type=instance_type,
            machine_image=machine_image,

            # ...

            block_devices=[
                ec2.BlockDevice(
                    device_name="/dev/sda1",
                    volume=ec2.BlockDeviceVolume.ebs(50)
                ),
                ec2.BlockDevice(
                    device_name="/dev/sdm",
                    volume=ec2.BlockDeviceVolume.ebs(100)
                ),
            ]
        )

    def _setup_rds_instance(self, vpc):
        pass
