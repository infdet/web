import {
  ActionIcon,
  Avatar,
  BackgroundImage,
  Badge,
  Box,
  Button,
  FileButton,
  Group,
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
        <AccountList
          accounts={influencer.accounts ?? []}
          showActions={showUpload}
          onCreateAccount={onCreateAccount}
          onUpdateAccount={onUpdateAccount}
          onDeleteAccount={onDeleteAccount}
        />
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
