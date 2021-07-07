import React, { useContext } from 'react';
import { Heading, Text, Box } from 'grommet';
import { authContext } from '../../auth';

const Header = () => {
  const { currentUser } = useContext(authContext);
  return (
    <Box
      background="brand"
      tag="header"
      direction="row"
      align="center"
      justify="between"
      pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    >
      <Heading flex wrap level="3" margin="none">
        Code For Denver Partner Finder
      </Heading>
      <Text>{currentUser}</Text>
    </Box>
  );
};

export default Header;
