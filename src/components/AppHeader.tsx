import { Anchor, AppShell, Burger, Button, Group } from '@mantine/core';
import { SignOutIcon, UserIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import LanguageSelect from '#components/LanguageSelect';
import useAuthUser from '#hooks/useAuthUser';
import useLogout from '#hooks/useLogout';

interface AppHeaderProps {
  opened: boolean;
  onToggle: () => void;
}

export default function AppHeader({ opened, onToggle }: AppHeaderProps) {
  const { t } = useTranslation();
  const [authUser] = useAuthUser();
  const handleLogout = useLogout();

  return (
    <AppShell.Header>
      <Group h='100%' px='md' wrap='nowrap'>
        <Burger opened={opened} onClick={onToggle} hiddenFrom='sm' size='sm' />
        <Group justify='space-between' style={{ flex: 1 }}>
          <Group gap='md'>
            <Anchor component={Link} href='/' underline='never' fw={700}>
              {t('app.title')}
            </Anchor>
            <Group gap={0} visibleFrom='sm'>
              <Anchor component={Link} href='/influencers' underline='never'>
                {t('nav.influencers')}
              </Anchor>
            </Group>
          </Group>

          <Group gap='sm' visibleFrom='sm'>
            <LanguageSelect />
            {authUser ? (
              <Button
                component={Link}
                href='/profile'
                variant='subtle'
                leftSection={<UserIcon size={18} />}
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
                leftSection={<SignOutIcon size={18} />}
                onClick={handleLogout}
              >
                {t('nav.logout')}
              </Button>
            )}
          </Group>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
