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
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'wouter';

import useAuthUser from '#hooks/useAuthUser';
import { register, setAuthToken } from '#services/auth';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [searchParams] = useSearchParams();
  const [, setAuthUser] = useAuthUser();
  const from = searchParams.get('from') ?? '';

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
      setError(t('auth.passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      const res = await register({ name, email, password, passwordConfirmation });
      setAuthToken(res.token);
      setAuthUser(res.user);
      navigate(from || '/');
    } catch (err: any) {
      const messages = err?.response?.data?.errors;
      if (Array.isArray(messages)) {
        setError(messages.map((m: { message: string }) => m.message).join(', '));
      } else {
        setError(err?.response?.data?.message || err?.message || t('auth.registrationFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Title ta='center'>{t('auth.createAccount')}</Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        {t('auth.haveAccount')}{' '}
        <Anchor
          size='sm'
          component='button'
          onClick={() => navigate(from ? `/login?from=${encodeURIComponent(from)}` : '/login')}
        >
          {t('auth.signIn')}
        </Anchor>
      </Text>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label={t('auth.name')}
              placeholder={t('auth.namePlaceholder')}
              required
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <TextInput
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label={t('auth.password')}
              placeholder={t('auth.passwordMinLength')}
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <PasswordInput
              label={t('auth.confirmPassword')}
              placeholder={t('auth.confirmPasswordPlaceholder')}
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
              {t('auth.createAccount')}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
