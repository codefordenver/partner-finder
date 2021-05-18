import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
} from 'grommet';

import { Inspect } from 'grommet-icons';
import { Link } from 'react-router-dom';
import React from 'react';

const LeadCard = (props) => {
  return (
    <Card pad="medium">
      <CardHeader flex pad="medium">
          <Heading level={2}>
            {props.companyName}
          </Heading>
        <Link to={`/leads/${props.id}`}>
            <Button secondary label="View" icon={<Inspect />} />
        </Link>
      </CardHeader>
      <CardBody pad="medium">
        <Text>
          <b>Address: </b> {props.companyAddress}
        </Text>
        <Text>
          <b>Date Registered: </b>
          {props.formationDate}
        </Text>
      </CardBody>
    </Card>
  );
};

export default LeadCard;
