import { Anchor, AppShell, Burger, Button, Group, Select, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SignOut, User } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';

import useAuthUser from '#hooks/useAuthUser';
import { logout, setAuthToken } from '#services/auth';

import classes from './AppLayout.module.css';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const [authUser, setAuthUser] = useAuthUser();
  const [, navigate] = useLocation();
  const [opened, { toggle, close }] = useDisclosure();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore logout API errors
    }
    setAuthToken('');
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
          {t('nav.profile')}
        </UnstyledButton>
      ) : (
        <UnstyledButton component={Link} href='/login' className={classes.control} onClick={close}>
          {t('nav.login')}
        </UnstyledButton>
      )}
      {authUser && (
        <UnstyledButton className={classes.control} c='red' onClick={handleLogout}>
          {t('nav.logout')}
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
                {t('app.title')}
              </Anchor>
              <Group gap={0} visibleFrom='sm'>
                <Anchor
                  component={Link}
                  href='/influencers'
                  className={classes.control}
                  underline='never'
                >
                  {t('nav.influencers')}
                </Anchor>
              </Group>
            </Group>

            <Group gap='sm' visibleFrom='sm'>
              <Select
                data={LANGUAGE_OPTIONS}
                value={i18n.language.split('-')[0]}
                onChange={(v) => v && i18n.changeLanguage(v)}
                size='xs'
                w={100}
              />
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
                  {t('nav.login')}
                </Button>
              )}
              {authUser && (
                <Button
                  variant='subtle'
                  color='red'
                  leftSection={<SignOut size={18} />}
                  onClick={handleLogout}
                >
                  {t('nav.logout')}
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
          {t('nav.influencers')}
        </UnstyledButton>
        {navLinks}
        <Select
          data={LANGUAGE_OPTIONS}
          value={i18n.language.split('-')[0]}
          onChange={(v) => v && i18n.changeLanguage(v)}
          size='xs'
          mt='md'
          mx='xs'
        />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
