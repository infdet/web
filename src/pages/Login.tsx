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
import { login, setAuthToken } from '#services/auth';

export default function LoginPage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [searchParams] = useSearchParams();
  const [, setAuthUser] = useAuthUser();
  const from = searchParams.get('from') ?? '';

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
      navigate(from || '/');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={80}>
      <Title ta='center'>{t('auth.welcomeBack')}</Title>
      <Text c='dimmed' size='sm' ta='center' mt={5}>
        {t('auth.noAccount')}{' '}
        <Anchor
          size='sm'
          component='button'
          onClick={() =>
            navigate(from ? `/register?from=${encodeURIComponent(from)}` : '/register')
          }
        >
          {t('auth.createAccount')}
        </Anchor>
      </Text>

      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
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
              {t('auth.signIn')}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
