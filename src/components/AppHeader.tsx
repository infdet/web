import { Anchor, Burger, Button, Group, Image } from '@mantine/core';
import { PlusIcon, SignOutIcon, UserIcon } from '@phosphor-icons/react';
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
    <Group h='100%' px='md' wrap='nowrap'>
      <Burger opened={opened} onClick={onToggle} hiddenFrom='sm' size='sm' />
      <Group justify='space-between' style={{ flex: 1 }}>
        <Group gap='md'>
          <Group gap='xs' wrap='nowrap' align='center'>
            <Image src='/favicon.svg' alt='' h={28} w={28} radius='sm' />
            <Anchor component={Link} href='/' underline='never' fw={700}>
              {t('app.title')}
            </Anchor>
          </Group>
          <Group gap='md' visibleFrom='sm'>
            <Anchor component={Link} href='/influencers' underline='never'>
              {t('nav.influencers')}
            </Anchor>
            <Anchor component={Link} href='/tags' underline='never'>
              {t('nav.tags')}
            </Anchor>
            <Button
              component={Link}
              href='/posts/new'
              variant='light'
              size='compact-sm'
              leftSection={<PlusIcon size={16} />}
            >
              {t('nav.newPost')}
            </Button>
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
  );
}
