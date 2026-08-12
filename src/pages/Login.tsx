import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { useLocation } from 'wouter';

import useAuthToken from '#hooks/useAuthToken';
import useAuthUser from '#hooks/useAuthUser';
import { login } from '#services/auth';

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [, setAuthToken] = useAuthToken();
  const [, setAuthUser] = useAuthUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      setAuthToken(res.token);
      setAuthUser(res.user);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Title ta='center'>Welcome back</Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        Don&apos;t have an account?{' '}
        <Anchor size='sm' component='button' onClick={() => navigate('/register')}>
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label='Email'
              placeholder='hello@example.com'
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label='Password'
              placeholder='Your password'
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            {error && (
              <Text c='red' size='sm'>
                {error}
              </Text>
            )}
            <Button type='submit' fullWidth loading={loading}>
              Sign in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
