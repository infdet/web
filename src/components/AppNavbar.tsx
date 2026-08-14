import { Button } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import LanguageSelect from '#components/LanguageSelect';
import useAuthUser from '#hooks/useAuthUser';
import useLogout from '#hooks/useLogout';

interface AppNavbarProps {
  onNavigate: () => void;
}

export default function AppNavbar({ onNavigate }: AppNavbarProps) {
  const { t } = useTranslation();
  const [authUser] = useAuthUser();
  const handleLogout = useLogout();

  return (
    <>
      <Button
        component={Link}
        href='/influencers'
        variant='subtle'
        fullWidth
        justify='start'
        onClick={onNavigate}
      >
        {t('nav.influencers')}
      </Button>

      <Button
        component={Link}
        href='/posts/new'
        variant='subtle'
        fullWidth
        justify='start'
        leftSection={<PlusIcon size={16} />}
        onClick={onNavigate}
      >
        {t('nav.newPost')}
      </Button>

      {authUser ? (
        <Button
          component={Link}
          href='/profile'
          variant='subtle'
          fullWidth
          justify='start'
          onClick={onNavigate}
        >
          {t('nav.profile')}
        </Button>
      ) : (
        <Button
          component={Link}
          href='/login'
          variant='subtle'
          fullWidth
          justify='start'
          onClick={onNavigate}
        >
          {t('nav.login')}
        </Button>
      )}

      {authUser && (
        <Button variant='subtle' color='red' fullWidth justify='start' onClick={handleLogout}>
          {t('nav.logout')}
        </Button>
      )}

      <LanguageSelect mt='md' mx='xs' />
    </>
  );
}
