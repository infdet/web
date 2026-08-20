import { Button, Group, Stack, Text } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AccountFormModal from '#components/AccountFormModal';
import AccountLink from '#components/AccountLink';
import { createAccount, deleteAccount, updateAccount } from '#services/account';
import type Account from '#types/Account';

interface AccountListProps {
  accounts: Account[];
  showActions: boolean;
  influencerId: number;
}

export default function AccountList({
  accounts: initialAccounts,
  showActions,
  influencerId,
}: AccountListProps) {
  const { t } = useTranslation();

  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  useEffect(() => {
    setAccounts(initialAccounts);
  }, [initialAccounts]);

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
      await deleteAccount(influencerId, account.id);
      setAccounts((prev) => prev.filter((a) => a.id !== account.id));
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
      const updated = await updateAccount(influencerId, editing.id, data);
      setAccounts((prev) => prev.map((a) => (a.id === editing.id ? updated : a)));
    } else {
      const created = await createAccount(influencerId, data);
      setAccounts((prev) => [...prev, created]);
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
