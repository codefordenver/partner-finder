import { Box, Button, Form, FormField, TextInput } from 'grommet'

const Login = () => {
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
                <Form onSubmit={({ value }) => {}}>
                    <FormField name="username" htmlFor="login-username" label="Username">
                        <TextInput id="login-username" name="name" />
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