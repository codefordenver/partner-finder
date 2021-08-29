#!/bin/bash
PRIVATE_KEY="$(cat $EC2_PRIVATE_KEY)"
aws ec2-instance-connect send-ssh-public-key \
    --instance-id $API_EC2_INSTANCE_ID \
    --availability-zone us-west-2b \
    --instance-os-user ec2-user \
    --ssh-public-key file://$EC2_PUBLIC_KEY
sleep 2
ssh -o "IdentitiesOnly=yes" -i $EC2_PRIVATE_KEY ec2-user@$EC2_DNS