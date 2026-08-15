import { Button, Group, Stack, Text } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import AccountFormModal from '#components/AccountFormModal';
import AccountLink from '#components/AccountLink';
import type Account from '#types/Account';

interface AccountListProps {
  accounts: Account[];
  showActions: boolean;
  onCreateAccount: (data: { platform: string; username: string }) => Promise<void>;
  onUpdateAccount: (id: number, data: { platform: string; username: string }) => Promise<void>;
  onDeleteAccount: (id: number) => Promise<void>;
}

export default function AccountList({
  accounts,
  showActions,
  onCreateAccount,
  onUpdateAccount,
  onDeleteAccount,
}: AccountListProps) {
  const { t } = useTranslation();
  const [modalOpened, setModalOpened] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [error, setError] = useState('');

  const openAdd = () => {
    setEditing(null);
    setError('');
    setModalOpened(true);
  };

  const openEdit = (account: Account) => {
    setEditing(account);
    setError('');
    setModalOpened(true);
  };

  const closeModal = () => {
    setModalOpened(false);
  };

  const handleDelete = async (account: Account) => {
    if (!window.confirm(t('influencer.deleteAccountConfirm'))) return;
    setError('');
    try {
      await onDeleteAccount(account.id);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          t('influencer.saveFailed'),
      );
    }
  };

  const handleSubmit = async (data: { platform: string; username: string }) => {
    if (editing) {
      await onUpdateAccount(editing.id, data);
    } else {
      await onCreateAccount(data);
    }
  };

  return (
    <>
      <Group justify='space-between'>
        <Text fw={600}>{t('influencer.accounts')}</Text>
        {showActions && (
          <Button size='xs' variant='light' leftSection={<PlusIcon size={14} />} onClick={openAdd}>
            {t('influencer.addAccount')}
          </Button>
        )}
      </Group>

      {accounts.length > 0 ? (
        <Stack gap='xs'>
          {accounts.map((account) => (
            <AccountLink
              key={account.id}
              account={account}
              showActions={showActions}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </Stack>
      ) : (
        <Text c='dimmed' size='sm'>
          {t('influencer.noAccounts')}
        </Text>
      )}

      {error && (
        <Text c='red' size='sm'>
          {error}
        </Text>
      )}

      <AccountFormModal
        opened={modalOpened}
        title={editing ? t('influencer.editAccount') : t('influencer.addAccount')}
        initialValues={
          editing ? { platform: editing.platform, username: editing.username } : undefined
        }
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}
