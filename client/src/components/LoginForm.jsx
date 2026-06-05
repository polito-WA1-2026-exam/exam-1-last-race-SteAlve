import { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Card, Stack, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { doLogin, doLogout } from '../api/auth.js';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError('');
    try {
      const user = await doLogin(username, password);
      props.doLogin(user);
    } catch {
      setError('Invalid username or password.');
    }
  };

  return (
    <Container fluid className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: 'calc(100vh - 110px)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
      <Card className='shadow-sm'>
        <Card.Header as='h4' className='bg-dark text-white'>Login</Card.Header>
        <Card.Body>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Stack gap={3}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  value={username}
                  onChange={ev => setUsername(ev.target.value)}
                  placeholder='Enter email'
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  value={password}
                  onChange={ev => setPassword(ev.target.value)}
                  placeholder='Enter password'
                  required
                />
              </Form.Group>
              <Button variant='dark' type='submit' className='w-100'>Login</Button>
            </Stack>
          </Form>
        </Card.Body>
      </Card>
      </div>
    </Container>
  );
}

function Logout(props) {
  const navigate = useNavigate();

  useEffect(() => {
    doLogout().then(() => {
      props.doLogin({ id: undefined, username: undefined, name: undefined });
      navigate('/');
    });
  }, []);

  return (
    <Container className='text-center mt-5'>
      <Spinner animation='border' variant='dark' />
      <p className='mt-2 text-muted'>Logging out...</p>
    </Container>
  );
}

export { LoginForm, Logout };