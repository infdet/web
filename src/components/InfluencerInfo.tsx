import { Anchor, FileInput, Image, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { CameraIcon, ImageIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import type Influencer from '#types/Influencer';

interface InfluencerInfoProps {
  influencer: Influencer;
  showUpload: boolean;
  uploadingAvatar: boolean;
  uploadingCover: boolean;
  onUploadAvatar: (file: File | null) => void;
  onUploadCover: (file: File | null) => void;
}

export default function InfluencerInfo({
  influencer,
  showUpload,
  uploadingAvatar,
  uploadingCover,
  onUploadAvatar,
  onUploadCover,
}: InfluencerInfoProps) {
  const { t } = useTranslation();

  return (
    <>
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
          <Text fw={600}>{t('influencer.accounts')}</Text>
          {influencer.accounts?.map((a) => (
            <Paper key={a.id} withBorder p='xs' radius='sm'>
              <Text size='sm' fw={500}>
                {a.platform}
              </Text>
              {a.url ? (
                <Anchor href={a.url} target='_blank' rel='noopener noreferrer' size='sm' c='dimmed'>
                  @{a.username}
                </Anchor>
              ) : (
                <Text size='sm' c='dimmed'>
                  @{a.username}
                </Text>
              )}
            </Paper>
          ))}
          {(!influencer.accounts || influencer.accounts.length === 0) && (
            <Text c='dimmed' size='sm'>
              {t('influencer.noAccounts')}
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
