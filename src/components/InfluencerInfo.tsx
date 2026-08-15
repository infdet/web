import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  FileButton,
  Group,
  Image,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { ArrowLeftIcon, CameraIcon, ImageIcon, PencilIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import AccountList from '#components/AccountList';
import useAuthUser from '#hooks/useAuthUser';
import type Influencer from '#types/Influencer';
import { getInfluencerName } from '#utils/influencer';

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

  return (
    <Group align='flex-start' gap='xl' wrap='wrap'>
      <Box pos='relative' w={300} mx={{ base: 'auto', sm: 0 }} style={{ flexShrink: 0 }}>
        {influencer.cover ? (
          <Image
            src={influencer.cover}
            alt={t('influencer.cover')}
            w='100%'
            radius='md'
            fit='cover'
            style={{ aspectRatio: '9 / 16' }}
          />
        ) : (
          <Box
            bg='gray.2'
            style={{
              aspectRatio: '9 / 16',
              borderRadius: 'var(--mantine-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageIcon size={40} color='var(--mantine-color-gray-5)' />
          </Box>
        )}

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
                >
                  <CameraIcon size={16} />
                </ActionIcon>
              </Tooltip>
            )}
          </FileButton>
        )}
      </Box>

      <Stack gap='md' style={{ flex: 1, minWidth: 280 }}>
        <Group justify='space-between'>
          <ActionIcon component={Link} href='/influencers' variant='subtle' color='gray'>
            <ArrowLeftIcon size={20} />
          </ActionIcon>
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

        <Group align='center' gap='md' wrap='nowrap'>
          <Box pos='relative'>
            <Avatar src={influencer.avatar ?? undefined} size={80} radius='50%' color='gray'>
              {!influencer.avatar && <CameraIcon size={28} />}
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
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <Title order={2}>{getInfluencerName(influencer.name, t('influencer.unknown'))}</Title>
            <Text c='dimmed'>@{influencer.slug}</Text>
          </Stack>
        </Group>

        <AccountList
          accounts={influencer.accounts ?? []}
          showActions={showUpload}
          onCreateAccount={onCreateAccount}
          onUpdateAccount={onUpdateAccount}
          onDeleteAccount={onDeleteAccount}
        />

        <Stack gap={4}>
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
      </Stack>
    </Group>
  );
}
