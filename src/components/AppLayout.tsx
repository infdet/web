import { AppShell, Anchor, Button, Group, Text } from '@mantine/core';
import { SignOut, User } from '@phosphor-icons/react';
import { Link, useLocation } from 'wouter';

import useAuthToken from '#hooks/useAuthToken';
import useAuthUser from '#hooks/useAuthUser';
import { logout } from '#services/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useAuthUser();
  const [, setAuthToken] = useAuthToken();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore logout API errors
    }
    setAuthToken(null);
    setAuthUser(null);
    navigate('/login');
  };

  return (
    <AppShell header={{ height: 56 }}>
      <AppShell.Header>
        <Group h='100%' justify='space-between' px='md'>
          <Anchor component={Link} href='/' underline='never' fw={700}>
            Influencer Detective
          </Anchor>

          <Group gap='sm'>
            <Button
              component={Link}
              href='/profile'
              variant='subtle'
              leftSection={<User size={18} />}
            >
              {authUser?.name ?? 'Profile'}
            </Button>
            <Button
              variant='subtle'
              color='red'
              leftSection={<SignOut size={18} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
