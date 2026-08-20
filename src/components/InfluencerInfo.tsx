import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { PencilIcon } from '@phosphor-icons/react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import AccountList from '#components/AccountList';
import GenderEmoji from '#components/GenderEmoji';
import InfluencerAvatar from '#components/InfluencerAvatar';
import InfluencerCover from '#components/InfluencerCover';
import InfluencerNameList from '#components/InfluencerNameList';
import RegionFlag from '#components/RegionFlag';
import TagList from '#components/TagList';
import useAuthUser from '#hooks/useAuthUser';
import type Influencer from '#types/Influencer';
import { getLocalizedName } from '#utils/localized';

interface InfluencerInfoProps {
  influencer: Influencer;
  onInfluencerChanged: (updated: Influencer) => void;
}

export default function InfluencerInfo({ influencer, onInfluencerChanged }: InfluencerInfoProps) {
  const { t } = useTranslation();

  const [authUser] = useAuthUser();
  const canEdit = authUser?.role === 'editor' || authUser?.role === 'admin';

  const metaParts = [
    influencer.gender ? <GenderEmoji key='gender' gender={influencer.gender} /> : null,
    <RegionFlag key='region' region={influencer.region} />,
    influencer.age != null ? `${t('influencer.age')} ${influencer.age}` : null,
    influencer.height != null ? `${t('influencer.height')} ${influencer.height}cm` : null,
    influencer.weight != null ? `${t('influencer.weight')} ${influencer.weight}kg` : null,
    influencer.bust != null || influencer.waist != null || influencer.hip != null
      ? `${t('influencer.measurements')} ${[influencer.bust, influencer.waist, influencer.hip]
          .map((v) => (v != null ? String(v) : '—'))
          .join('-')}cm`
      : null,
  ].filter((part) => part != null);

  return (
    <Group align='flex-start' gap='xl' wrap='wrap'>
      <InfluencerCover
        src={influencer.cover}
        showUpload={canEdit}
        influencerId={influencer.id}
        onCoverChanged={onInfluencerChanged}
      />

      <Stack gap='md' style={{ flex: 1, minWidth: 280 }}>
        <Group align='center' gap='md' wrap='nowrap'>
          <InfluencerAvatar
            src={influencer.avatar}
            showUpload={canEdit}
            influencerId={influencer.id}
            onAvatarChanged={onInfluencerChanged}
          />
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <Title order={2}>{getLocalizedName(influencer.name, t('influencer.unknown'))}</Title>
            <InfluencerNameList name={influencer.name} />
            {metaParts.length > 0 && (
              <Text size='sm' c='dimmed'>
                {metaParts.map((part, index) => (
                  <Fragment key={index}>
                    {index > 0 && ' · '}
                    {part}
                  </Fragment>
                ))}
              </Text>
            )}
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
          showActions={canEdit}
          influencerId={influencer.id}
        />

        <TagList
          tags={influencer.tags ?? []}
          showActions={canEdit}
          entityType='influencer'
          entityId={influencer.id}
        />
      </Stack>
    </Group>
  );
}
