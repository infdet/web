import { Anchor, AppShell, Burger, Button, Group, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SignOut, User } from '@phosphor-icons/react';
import { Link, useLocation } from 'wouter';

import useAuthToken from '#hooks/useAuthToken';
import useAuthUser from '#hooks/useAuthUser';
import { logout } from '#services/auth';

import classes from './AppLayout.module.css';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useAuthUser();
  const [, setAuthToken] = useAuthToken();
  const [, navigate] = useLocation();
  const [opened, { toggle, close }] = useDisclosure();

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

  const navLinks = (
    <>
      {authUser ? (
        <UnstyledButton
          component={Link}
          href='/profile'
          className={classes.control}
          onClick={close}
        >
          Profile
        </UnstyledButton>
      ) : (
        <UnstyledButton component={Link} href='/login' className={classes.control} onClick={close}>
          Login
        </UnstyledButton>
      )}
      {authUser && (
        <UnstyledButton className={classes.control} c='red' onClick={handleLogout}>
          Logout
        </UnstyledButton>
      )}
    </>
  );

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Group h='100%' px='md' wrap='nowrap'>
          <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
          <Group justify='space-between' style={{ flex: 1 }}>
            <Group gap='md'>
              <Anchor component={Link} href='/' underline='never' fw={700}>
                Influencer Detective
              </Anchor>
              <Group gap={0} visibleFrom='sm'>
                <Anchor
                  component={Link}
                  href='/influencers'
                  className={classes.control}
                  underline='never'
                >
                  Influencers
                </Anchor>
              </Group>
            </Group>

            <Group gap='sm' visibleFrom='sm'>
              {authUser ? (
                <Button
                  component={Link}
                  href='/profile'
                  variant='subtle'
                  leftSection={<User size={18} />}
                >
                  {authUser.name}
                </Button>
              ) : (
                <Button component={Link} href='/login' variant='subtle'>
                  Login
                </Button>
              )}
              {authUser && (
                <Button
                  variant='subtle'
                  color='red'
                  leftSection={<SignOut size={18} />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py='md' px={4}>
        <UnstyledButton
          component={Link}
          href='/influencers'
          className={classes.control}
          onClick={close}
        >
          Influencers
        </UnstyledButton>
        {navLinks}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
