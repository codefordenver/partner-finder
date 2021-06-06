import { Box, Button, Form, FormField, TextInput } from 'grommet'

import { config } from '../../config';

const Login = () => {
    const loginUser = (username, password) => {
        return fetch(`${config.backendHost}/login`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password,
            }),
            headers: {
                // 'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(res => console.log(res))
    }

    return (
        <Box
            direction="row"
            justify="center"
            align="center"
            height="100%"
        >
            <Box
                border="true"
                border-radius="10px"
                pad="large"
            >
                <Form onSubmit={({ value }) => loginUser(value.username, value.password)}>
                    <FormField name="username" htmlFor="login-username" label="Username">
                        <TextInput id="login-username" name="username" />
                    </FormField>
                    <FormField name="password" htmlFor="login-password" label="Password">
                        <TextInput type="password" id="login-password" name="password" />
                    </FormField>
                    <Box direction="row" gap="medium">
                        <Button type="submit" primary label="Submit" />
                        <Button type="reset" label="Reset" />
                    </Box>
                </Form>
            </Box>
        </Box>
      );
}


export default Login;
