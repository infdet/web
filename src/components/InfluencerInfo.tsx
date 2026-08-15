import { Button, Group, Stack, Title } from '@mantine/core';
import { PencilIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import AccountList from '#components/AccountList';
import InfluencerAvatar from '#components/InfluencerAvatar';
import InfluencerCover from '#components/InfluencerCover';
import InfluencerNameList from '#components/InfluencerNameList';
import TagList from '#components/TagList';
import useAuthUser from '#hooks/useAuthUser';
import type Influencer from '#types/Influencer';
import { getLocalizedName } from '#utils/localized';

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
  onAttachTags: (tagIds: number[]) => Promise<void>;
  onDetachTag: (tagId: number) => Promise<void>;
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
  onAttachTags,
  onDetachTag,
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
        <Group align='center' gap='md' wrap='nowrap'>
          <InfluencerAvatar
            src={influencer.avatar}
            showUpload={showUpload}
            uploading={uploadingAvatar}
            onUpload={onUploadAvatar}
          />
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <Title order={2}>{getLocalizedName(influencer.name, t('influencer.unknown'))}</Title>
            <InfluencerNameList name={influencer.name} />
          </Stack>
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

        <AccountList
          accounts={influencer.accounts ?? []}
          showActions={showUpload}
          onCreateAccount={onCreateAccount}
          onUpdateAccount={onUpdateAccount}
          onDeleteAccount={onDeleteAccount}
        />

        <TagList
          tags={influencer.tags ?? []}
          showActions={showUpload}
          forInfluencerOnly
          onAttach={onAttachTags}
          onDetach={onDetachTag}
        />
      </Stack>
    </Group>
  );
}
