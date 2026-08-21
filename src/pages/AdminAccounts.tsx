import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Loader,
  Pagination,
  Select,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  DownloadSimpleIcon,
  MagicWandIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AccountFormModal from '#components/AccountFormModal';
import PlatformIcon from '#components/PlatformIcon';
import {
  createAccountAdmin,
  deleteAccountAdmin,
  getAccountsAdmin,
  importAccountPosts,
  inferAccountPostInfluencers,
  updateAccountAdmin,
} from '#services/account';
import type Account from '#types/Account';
import { PLATFORM_OPTIONS } from '#utils/platforms';

const PER_PAGE = 20;

export default function AdminAccountsPage() {
  const { t } = useTranslation();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [modalOpened, setModalOpened] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [error, setError] = useState('');
  const [importingId, setImportingId] = useState<number | null>(null);
  const [inferringId, setInferringId] = useState<number | null>(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const params: { page: number; perPage: number; platform?: string } = {
        page,
        perPage: PER_PAGE,
      };
      if (platformFilter) params.platform = platformFilter;

      const res = await getAccountsAdmin(params);
      setAccounts(res.data);
      setTotal(res.metadata.total);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || t('admin.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [page, platformFilter]);

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

  const handleDelete = async (account: Account) => {
    if (!window.confirm(t('admin.deleteAccountConfirm'))) return;
    setError('');
    try {
      await deleteAccountAdmin(account.id);
      setAccounts((prev) => prev.filter((a) => a.id !== account.id));
      setTotal((prev) => prev - 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || t('admin.saveFailed'));
    }
  };

  const handleImport = async (account: Account, full = false) => {
    setError('');
    setImportingId(account.id);
    try {
      const result = await importAccountPosts(account.id, full);
      alert(
        `${t('admin.importDone')}: ${t('admin.importTotal')} ${result.total}, ${t('admin.importCreated')} ${result.created}, ${t('admin.importAttached')} ${result.attached}`,
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || t('admin.saveFailed'));
    } finally {
      setImportingId(null);
    }
  };

  const handleInfer = async (account: Account) => {
    setError('');
    setInferringId(account.id);
    try {
      const result = await inferAccountPostInfluencers(account.id);
      alert(
        `${t('admin.inferDone')}: ${t('admin.inferTotal')} ${result.total}, ${t('admin.inferMatched')} ${result.matched}`,
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || t('admin.saveFailed'));
    } finally {
      setInferringId(null);
    }
  };

  const handleSubmit = async (data: { platform: string; username: string }) => {
    if (editing) {
      const updated = await updateAccountAdmin(editing.id, data);
      setAccounts((prev) => prev.map((a) => (a.id === editing.id ? updated : a)));
    } else {
      const created = await createAccountAdmin(data);
      setAccounts((prev) => [created, ...prev]);
      setTotal((prev) => prev + 1);
    }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div style={{ padding: 24 }}>
      <Group justify='space-between' mb='md'>
        <Text size='xl' fw={700}>
          {t('admin.accounts')}
        </Text>
        <Button leftSection={<PlusIcon size={16} />} onClick={openAdd}>
          {t('admin.addAccount')}
        </Button>
      </Group>

      <Group mb='md'>
        <Select
          placeholder={t('admin.filterByPlatform')}
          data={PLATFORM_OPTIONS}
          value={platformFilter}
          onChange={(v) => {
            setPlatformFilter(v);
            setPage(1);
          }}
          clearable
          searchable
          w={200}
        />
      </Group>

      {error && (
        <Text c='red' size='sm' mb='sm'>
          {error}
        </Text>
      )}

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>{t('admin.platform')}</Table.Th>
            <Table.Th>{t('admin.username')}</Table.Th>
            <Table.Th>{t('admin.url')}</Table.Th>
            <Table.Th style={{ width: 70 }}>{t('admin.posts')}</Table.Th>
            <Table.Th style={{ width: 100 }} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {accounts.length === 0 && !loading ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text c='dimmed' ta='center' py='md'>
                  {t('admin.noAccounts')}
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            accounts.map((account) => (
              <Table.Tr key={account.id}>
                <Table.Td>{account.id}</Table.Td>
                <Table.Td>
                  <Badge
                    variant='light'
                    leftSection={<PlatformIcon platform={account.platform} size={14} />}
                  >
                    {account.platform}
                  </Badge>
                </Table.Td>
                <Table.Td>@{account.username}</Table.Td>
                <Table.Td>
                  {account.url ? (
                    <Text
                      component='a'
                      href={account.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      size='sm'
                      truncate
                      maw={300}
                    >
                      {account.url}
                    </Text>
                  ) : (
                    <Text c='dimmed' size='sm'>
                      —
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Badge variant='light' color='gray'>
                    {account.postCount ?? 0}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap={4} wrap='nowrap'>
                    {importingId === account.id ? (
                      <Loader size={16} />
                    ) : (
                      <>
                        <Tooltip label={t('admin.importPosts')}>
                          <ActionIcon
                            variant='subtle'
                            color='green'
                            onClick={() => handleImport(account)}
                          >
                            <DownloadSimpleIcon size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label={t('admin.importAllPosts')}>
                          <ActionIcon
                            variant='subtle'
                            color='orange'
                            onClick={() => handleImport(account, true)}
                          >
                            <DownloadSimpleIcon size={16} weight='fill' />
                          </ActionIcon>
                        </Tooltip>
                      </>
                    )}
                    {inferringId === account.id ? (
                      <Loader size={16} />
                    ) : (
                      <ActionIcon
                        variant='subtle'
                        color='violet'
                        onClick={() => handleInfer(account)}
                      >
                        <MagicWandIcon size={16} />
                      </ActionIcon>
                    )}
                    <ActionIcon variant='subtle' color='blue' onClick={() => openEdit(account)}>
                      <PencilIcon size={16} />
                    </ActionIcon>
                    <ActionIcon variant='subtle' color='red' onClick={() => handleDelete(account)}>
                      <TrashIcon size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {totalPages > 1 && (
        <Group justify='center' mt='md'>
          <Pagination total={totalPages} value={page} onChange={setPage} />
        </Group>
      )}

      <AccountFormModal
        opened={modalOpened}
        title={editing ? t('admin.editAccount') : t('admin.addAccount')}
        initialValues={
          editing ? { platform: editing.platform, username: editing.username } : undefined
        }
        onClose={() => setModalOpened(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
