import {
  ActionIcon,
  Avatar,
  BackgroundImage,
  Badge,
  Box,
  Button,
  FileButton,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  FacebookLogo,
  GlobeSimple,
  ImageIcon,
  InstagramLogo,
  PencilIcon,
  PlusIcon,
  TiktokLogo,
  TrashIcon,
  XIcon,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
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

const PLATFORM_ICONS: Record<string, Icon> = {
  youtube: YoutubeLogo,
  instagram: InstagramLogo,
  tiktok: TiktokLogo,
  twitter: XLogo,
  facebook: FacebookLogo,
  bilibili: GlobeSimple,
  weibo: GlobeSimple,
  douyin: GlobeSimple,
  xiaohongshu: GlobeSimple,
  other: GlobeSimple,
};

function PlatformIcon({ platform, size = 16 }: { platform: string; size?: number }) {
  const IconComponent = PLATFORM_ICONS[platform] ?? GlobeSimple;
  return <IconComponent size={size} />;
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
    <Box>
      <Box pos='relative'>
        {influencer.cover ? (
          <BackgroundImage src={influencer.cover} h={{ base: 150, sm: 200 }} radius='md' />
        ) : (
          <Box
            h={{ base: 150, sm: 200 }}
            bg='gray.2'
            style={{ borderRadius: 'var(--mantine-radius-md)' }}
          >
            <Group h='100%' justify='center'>
              <ImageIcon size={40} color='var(--mantine-color-gray-5)' />
            </Group>
          </Box>
        )}

        <ActionIcon
          component={Link}
          href='/influencers'
          variant='filled'
          color='dark'
          radius='xl'
          aria-label={t('influencer.list')}
          pos='absolute'
          top={12}
          left={12}
          style={{ opacity: 0.85 }}
        >
          <ArrowLeftIcon size={18} />
        </ActionIcon>

        {showUpload && (
          <FileButton onChange={onUploadCover} accept='image/*'>
            {(props) => (
              <Tooltip label={t('influencer.uploadCover')} withArrow>
                <ActionIcon
                  {...props}
                  variant='filled'
                  color='dark'
                  radius='xl'
                  aria-label={t('influencer.uploadCover')}
                  loading={uploadingCover}
                  pos='absolute'
                  top={12}
                  right={12}
                  style={{ opacity: 0.85 }}
                >
                  <CameraIcon size={16} />
                </ActionIcon>
              </Tooltip>
            )}
          </FileButton>
        )}
      </Box>

      <Group justify='space-between' align='flex-end' px='md' mt={-40}>
        <Box pos='relative'>
          <Avatar
            src={influencer.avatar ?? undefined}
            size={96}
            radius='50%'
            color='gray'
            style={{ border: '4px solid var(--mantine-color-body)' }}
          >
            {!influencer.avatar && <CameraIcon size={32} />}
          </Avatar>
          {showUpload && (
            <FileButton onChange={onUploadAvatar} accept='image/*'>
              {(props) => (
                <Tooltip label={t('influencer.uploadAvatar')} withArrow>
                  <ActionIcon
                    {...props}
                    variant='filled'
                    color='dark'
                    radius='xl'
                    size='sm'
                    aria-label={t('influencer.uploadAvatar')}
                    loading={uploadingAvatar}
                    pos='absolute'
                    bottom={0}
                    right={0}
                  >
                    <CameraIcon size={14} />
                  </ActionIcon>
                </Tooltip>
              )}
            </FileButton>
          )}
        </Box>

        {authUser && (
          <Button
            component={Link}
            href={`/influencers/${influencer.id}/edit`}
            variant='light'
            leftSection={<PencilIcon size={14} />}
          >
            {t('influencer.edit')}
          </Button>
        )}
      </Group>

      <Stack gap={2} px='md' mt='sm'>
        <Title order={2}>{getInfluencerName(influencer.name, t('influencer.unknown'))}</Title>
        <Text c='dimmed'>@{influencer.slug}</Text>
      </Stack>

      <Stack gap='xs' px='md' mt='lg'>
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
            <Paper key={a.id} withBorder p='xs' radius='md'>
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
            <Group key={a.id} gap='xs' wrap='nowrap'>
              {a.url ? (
                <Badge
                  component='a'
                  href={a.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  variant='light'
                  size='lg'
                  radius='xl'
                  leftSection={<PlatformIcon platform={a.platform} size={16} />}
                >
                  @{a.username}
                </Badge>
              ) : (
                <Badge
                  variant='light'
                  size='lg'
                  radius='xl'
                  leftSection={<PlatformIcon platform={a.platform} size={16} />}
                >
                  @{a.username}
                </Badge>
              )}
              {showUpload && (
                <Group gap={2} wrap='nowrap'>
                  <ActionIcon variant='subtle' color='blue' size='sm' onClick={() => startEdit(a)}>
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
          ),
        )}

        {(!influencer.accounts || influencer.accounts.length === 0) && !adding && (
          <Text c='dimmed' size='sm'>
            {t('influencer.noAccounts')}
          </Text>
        )}

        {adding && (
          <Paper withBorder p='xs' radius='md'>
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

        {error && (
          <Text c='red' size='sm'>
            {error}
          </Text>
        )}
      </Stack>

      <Stack gap={4} px='md' mt='lg'>
        <Text fw={600}>{t('influencer.name')}</Text>
        {Object.entries(influencer.name).map(([locale, name]) => (
          <Group key={locale} gap='xs'>
            <Badge variant='outline' size='xs' tt='uppercase'>
              {locale}
            </Badge>
            <Text size='sm' c='dimmed'>
              {name}
            </Text>
          </Group>
        ))}
      </Stack>
    </Box>
  );
}
