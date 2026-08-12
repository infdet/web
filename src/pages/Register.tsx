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
import { register } from '#services/auth';

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const [, setAuthToken] = useAuthToken();
  const [, setAuthUser] = useAuthUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await register({ name, email, password, passwordConfirmation });
      setAuthToken(res.token);
      setAuthUser(res.user);
      navigate('/');
    } catch (err: any) {
      const messages = err?.response?.data?.errors;
      if (Array.isArray(messages)) {
        setError(messages.map((m: { message: string }) => m.message).join(', '));
      } else {
        setError(err?.response?.data?.message || err?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Title ta='center'>Create account</Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        Already have an account?{' '}
        <Anchor size='sm' component='button' onClick={() => navigate('/login')}>
          Sign in
        </Anchor>
      </Text>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label='Name'
              placeholder='Your name'
              required
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <TextInput
              label='Email'
              placeholder='hello@example.com'
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label='Password'
              placeholder='At least 8 characters'
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <PasswordInput
              label='Confirm Password'
              placeholder='Repeat your password'
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.currentTarget.value)}
            />
            {error && (
              <Text c='red' size='sm'>
                {error}
              </Text>
            )}
            <Button type='submit' fullWidth loading={loading}>
              Create account
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
