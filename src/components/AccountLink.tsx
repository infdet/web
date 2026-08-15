import { ActionIcon, Badge, Group } from '@mantine/core';
import { PencilIcon, TrashIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import PlatformIcon from '#components/PlatformIcon';
import type Account from '#types/Account';

interface AccountLinkProps {
  account: Account;
  showActions?: boolean;
  onEdit?: (account: Account) => void;
  onDelete?: (account: Account) => void;
}

export default function AccountLink({
  account,
  showActions = false,
  onEdit,
  onDelete,
}: AccountLinkProps) {
  const { t } = useTranslation();

  return (
    <Group gap='xs' wrap='nowrap'>
      {account.url ? (
        <Badge
          component='a'
          href={account.url}
          target='_blank'
          rel='noopener noreferrer'
          variant='light'
          size='lg'
          radius='xl'
          leftSection={<PlatformIcon platform={account.platform} size={16} />}
        >
          @{account.username}
        </Badge>
      ) : (
        <Badge
          variant='light'
          size='lg'
          radius='xl'
          leftSection={<PlatformIcon platform={account.platform} size={16} />}
        >
          @{account.username}
        </Badge>
      )}
      {showActions && (
        <Group gap={2} wrap='nowrap'>
          <ActionIcon
            variant='subtle'
            color='blue'
            size='sm'
            aria-label={t('influencer.editAccount')}
            onClick={() => onEdit?.(account)}
          >
            <PencilIcon size={14} />
          </ActionIcon>
          <ActionIcon
            variant='subtle'
            color='red'
            size='sm'
            aria-label={t('influencer.deleteAccount')}
            onClick={() => onDelete?.(account)}
          >
            <TrashIcon size={14} />
          </ActionIcon>
        </Group>
      )}
    </Group>
  );
}
