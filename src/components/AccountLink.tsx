import { ActionIcon, Badge, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { DownloadSimpleIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PlatformIcon from '#components/PlatformIcon';
import { importAccountPosts } from '#services/account';
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
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    total: number;
    created: number;
    attached: number;
  } | null>(null);
  const [importError, setImportError] = useState('');

  const handleImport = async (full: boolean) => {
    setImporting(true);
    setImportError('');
    try {
      const result = await importAccountPosts(account.id, full);
      setImportResult(result);
    } catch (err: any) {
      setImportError(err?.response?.data?.message || err?.message || t('admin.saveFailed'));
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
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
              color='green'
              size='sm'
              loading={importing}
              aria-label={t('admin.importPosts')}
              onClick={() => handleImport(false)}
            >
              <DownloadSimpleIcon size={14} />
            </ActionIcon>
            <ActionIcon
              variant='subtle'
              color='orange'
              size='sm'
              loading={importing}
              aria-label={t('admin.importAllPosts')}
              onClick={() => handleImport(true)}
            >
              <DownloadSimpleIcon size={14} weight='fill' />
            </ActionIcon>
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

      <Modal
        opened={importResult !== null || !!importError}
        onClose={() => {
          setImportResult(null);
          setImportError('');
        }}
        title={t('admin.importPosts')}
        size='sm'
      >
        {importError ? (
          <Text c='red'>{importError}</Text>
        ) : importResult ? (
          <Stack gap='xs'>
            <Text>{t('admin.importDone')}</Text>
            <Group gap='md'>
              <Text size='sm'>
                {t('admin.importTotal')}: {importResult.total}
              </Text>
              <Text size='sm'>
                {t('admin.importCreated')}: {importResult.created}
              </Text>
              <Text size='sm'>
                {t('admin.importAttached')}: {importResult.attached}
              </Text>
            </Group>
          </Stack>
        ) : null}
      </Modal>
    </>
  );
}
