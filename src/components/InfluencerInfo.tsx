import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  FileInput,
  Group,
  Image,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  ImageIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import useAuthUser from '#hooks/useAuthUser';
import type Account from '#types/Account';
import type Influencer from '#types/Influencer';
import { getInfluencerName } from '#utils/influencer';
import { PLATFORM_OPTIONS } from '#utils/platforms';

interface InfluencerInfoProps {
  influencer: Influencer;
  showUpload: boolean;
  uploadingAvatar: boolean;
  uploadingCover: boolean;
  onUploadAvatar: (file: File | null) => void;
  onUploadCover: (file: File | null) => void;
  onCreateAccount: (data: { platform: string; username: string }) => Promise<void>;
  onUpdateAccount: (id: number, data: { platform: string; username: string }) => Promise<void>;
  onDeleteAccount: (id: number) => Promise<void>;
}

export default function InfluencerInfo({
  influencer,
  showUpload,
  uploadingAvatar,
  uploadingCover,
  onUploadAvatar,
  onUploadCover,
  onCreateAccount,
  onUpdateAccount,
  onDeleteAccount,
}: InfluencerInfoProps) {
  const { t } = useTranslation();

  const [authUser] = useAuthUser();

  const [adding, setAdding] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingPlatform, setEditingPlatform] = useState('');
  const [editingUsername, setEditingUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startEdit = (account: Account) => {
    setEditingId(account.id);
    setEditingPlatform(account.platform);
    setEditingUsername(account.username);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingPlatform('');
    setEditingUsername('');
  };

  const saveEdit = async (id: number) => {
    setSaving(true);
    setError('');
    try {
      await onUpdateAccount(id, { platform: editingPlatform, username: editingUsername });
      cancelEdit();
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          t('influencer.saveFailed'),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    setSaving(true);
    setError('');
    try {
      await onCreateAccount({ platform: newPlatform, username: newUsername });
      setAdding(false);
      setNewPlatform('');
      setNewUsername('');
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          t('influencer.saveFailed'),
      );
    } finally {
      setSaving(false);
    }
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

  return (
    <>
      <Group mb='xl'>
        <ActionIcon component={Link} href='/influencers' variant='subtle'>
          <ArrowLeftIcon size={20} />
        </ActionIcon>
        <Title order={2}>{getInfluencerName(influencer.name, t('influencer.unknown'))}</Title>
        <Badge variant='light'>@{influencer.slug}</Badge>
        {authUser && (
          <ActionIcon
            component={Link}
            href={`/influencers/${influencer.id}/edit`}
            variant='subtle'
            color='blue'
          >
            <PencilIcon size={18} />
          </ActionIcon>
        )}
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='lg'>
        <Paper withBorder p='md' radius='md'>
          <Text fw={600} mb='sm'>
            {t('influencer.avatar')}
          </Text>
          {influencer.avatar ? (
            <Image
              src={influencer.avatar}
              alt='Avatar'
              width={120}
              height={120}
              radius='md'
              fit='cover'
            />
          ) : (
            <Paper
              bg='gray.1'
              w={120}
              h={120}
              radius='md'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <CameraIcon size={32} color='var(--mantine-color-gray-5)' />
            </Paper>
          )}
          {showUpload && (
            <FileInput
              mt='sm'
              size='sm'
              placeholder={t('influencer.uploadAvatar')}
              accept='image/*'
              leftSection={<ImageIcon size={14} />}
              value={null}
              onChange={onUploadAvatar}
              disabled={uploadingAvatar}
              clearable={false}
            />
          )}
        </Paper>

        <Paper withBorder p='md' radius='md'>
          <Text fw={600} mb='sm'>
            {t('influencer.cover')}
          </Text>
          {influencer.cover ? (
            <Image
              src={influencer.cover}
              alt='Cover'
              width={180}
              height={320}
              radius='md'
              fit='cover'
            />
          ) : (
            <Paper
              bg='gray.1'
              w={180}
              h={320}
              radius='md'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ImageIcon size={32} color='var(--mantine-color-gray-5)' />
            </Paper>
          )}
          {showUpload && (
            <FileInput
              mt='sm'
              size='sm'
              placeholder={t('influencer.uploadCover')}
              accept='image/*'
              leftSection={<ImageIcon size={14} />}
              value={null}
              onChange={onUploadCover}
              disabled={uploadingCover}
              clearable={false}
            />
          )}
        </Paper>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='lg' mt='lg'>
        <Stack gap='xs'>
          <Group justify='space-between'>
            <Text fw={600}>{t('influencer.accounts')}</Text>
            {showUpload && (
              <Button
                size='xs'
                variant='light'
                leftSection={<PlusIcon size={14} />}
                onClick={() => setAdding(true)}
              >
                {t('influencer.addAccount')}
              </Button>
            )}
          </Group>

          {influencer.accounts?.map((a) =>
            editingId === a.id ? (
              <Paper key={a.id} withBorder p='xs' radius='sm'>
                <Stack gap='xs'>
                  <Select
                    size='xs'
                    data={PLATFORM_OPTIONS}
                    value={editingPlatform}
                    onChange={(v) => setEditingPlatform(v ?? '')}
                    searchable
                  />
                  <TextInput
                    size='xs'
                    value={editingUsername}
                    onChange={(e) => setEditingUsername(e.currentTarget.value)}
                  />
                  <Group gap='xs' justify='flex-end'>
                    <ActionIcon variant='subtle' size='sm' onClick={cancelEdit}>
                      <XIcon size={14} />
                    </ActionIcon>
                    <ActionIcon
                      variant='subtle'
                      color='green'
                      size='sm'
                      loading={saving}
                      disabled={!editingPlatform || !editingUsername}
                      onClick={() => saveEdit(a.id)}
                    >
                      <CheckIcon size={14} />
                    </ActionIcon>
                  </Group>
                </Stack>
              </Paper>
            ) : (
              <Paper key={a.id} withBorder p='xs' radius='sm'>
                <Group justify='space-between' wrap='nowrap'>
                  <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                    <Text size='sm' fw={500}>
                      {a.platform}
                    </Text>
                    {a.url ? (
                      <Anchor
                        href={a.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        size='sm'
                        c='dimmed'
                        truncate
                      >
                        @{a.username}
                      </Anchor>
                    ) : (
                      <Text size='sm' c='dimmed' truncate>
                        @{a.username}
                      </Text>
                    )}
                  </Stack>
                  {showUpload && (
                    <Group gap={4} wrap='nowrap'>
                      <ActionIcon
                        variant='subtle'
                        color='blue'
                        size='sm'
                        onClick={() => startEdit(a)}
                      >
                        <PencilIcon size={14} />
                      </ActionIcon>
                      <ActionIcon
                        variant='subtle'
                        color='red'
                        size='sm'
                        onClick={() => handleDelete(a)}
                      >
                        <TrashIcon size={14} />
                      </ActionIcon>
                    </Group>
                  )}
                </Group>
              </Paper>
            ),
          )}

          {adding && (
            <Paper withBorder p='xs' radius='sm'>
              <Stack gap='xs'>
                <Select
                  size='xs'
                  data={PLATFORM_OPTIONS}
                  placeholder={t('influencer.platformPlaceholder')}
                  value={newPlatform}
                  onChange={(v) => setNewPlatform(v ?? '')}
                  searchable
                />
                <TextInput
                  size='xs'
                  placeholder={t('influencer.usernamePlaceholder')}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.currentTarget.value)}
                />
                <Group gap='xs' justify='flex-end'>
                  <ActionIcon variant='subtle' size='sm' onClick={() => setAdding(false)}>
                    <XIcon size={14} />
                  </ActionIcon>
                  <ActionIcon
                    variant='subtle'
                    color='green'
                    size='sm'
                    loading={saving}
                    disabled={!newPlatform || !newUsername}
                    onClick={handleAdd}
                  >
                    <CheckIcon size={14} />
                  </ActionIcon>
                </Group>
              </Stack>
            </Paper>
          )}

          {(!influencer.accounts || influencer.accounts.length === 0) && !adding && (
            <Text c='dimmed' size='sm'>
              {t('influencer.noAccounts')}
            </Text>
          )}

          {error && (
            <Text c='red' size='sm'>
              {error}
            </Text>
          )}
        </Stack>

        <Stack gap='xs'>
          <Text fw={600}>{t('influencer.name')}</Text>
          {Object.entries(influencer.name).map(([locale, name]) => (
            <Text key={locale} size='sm' c='dimmed'>
              {locale}: {name}
            </Text>
          ))}
        </Stack>
      </SimpleGrid>
    </>
  );
}
