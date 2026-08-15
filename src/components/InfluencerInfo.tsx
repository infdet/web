import { ActionIcon, Badge, Button, Group, Stack, Text, Title } from '@mantine/core';
import { ArrowLeftIcon, PencilIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import AccountList from '#components/AccountList';
import InfluencerAvatar from '#components/InfluencerAvatar';
import InfluencerCover from '#components/InfluencerCover';
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
      <InfluencerCover
        src={influencer.cover}
        showUpload={showUpload}
        uploading={uploadingCover}
        onUpload={onUploadCover}
      />

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
          <InfluencerAvatar
            src={influencer.avatar}
            showUpload={showUpload}
            uploading={uploadingAvatar}
            onUpload={onUploadAvatar}
          />
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
