import { Box, Button, Form, FormField, TextInput } from 'grommet'
import React, { useState } from 'react';

import { Notification } from 'grommet-controls'
import { config } from '../../config';
import { useHistory } from 'react-router-dom'

const Login = () => {
    const [loginFailed, setLoginFailed] = useState(false);
    const history = useHistory();

    const loginUser = (username, password) => {
        return fetch(`${config.backendHost}/login`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => {
            console.log('status', res.status)
            if (res.status === 200) {
                return res.json()
            }
        })
        .then(data => {
            let token = data.token
            // TODO: check for alternative method to local storage for saving token
            window.localStorage.setItem('token', token);
            history.push('/home')
        })
        .catch(error => {
            setLoginFailed(true);
        })
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
                {
                    loginFailed && (
                        <Notification
                            status="error"
                            size="medium"
                            message="Invalid username or password. Please try again."
                        />
                    )
                }
                <Form onSubmit={({ value }) => loginUser(value.username, value.password)}>
                    <FormField
                        name="username"
                        htmlFor="login-username"
                        label="Username"
                    >
                        <TextInput
                            id="login-username"
                            name="username"
                            onChange={e => setLoginFailed(false)}
                        />
                    </FormField>
                    <FormField
                        name="password"
                        htmlFor="login-password"
                        label="Password"
                    >
                        <TextInput
                            type="password"
                            id="login-password"
                            name="password"
                            onChange={e => setLoginFailed(false)}
                        />
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
