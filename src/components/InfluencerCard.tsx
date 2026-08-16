import { Avatar, Card, Group, Image, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import GenderEmoji from '#components/GenderEmoji';
import InfluencerNameList from '#components/InfluencerNameList';
import RegionFlag from '#components/RegionFlag';
import type Influencer from '#types/Influencer';
import { getLocalizedName } from '#utils/localized';

interface InfluencerCardProps {
  influencer: Influencer;
  actions?: ReactNode;
}

export default function InfluencerCard({ influencer, actions }: InfluencerCardProps) {
  const { t } = useTranslation();

  const localeName = getLocalizedName(influencer.name, t('influencer.unknown'));

  return (
    <Card
      component={Link}
      href={`/influencers/${influencer.id}`}
      shadow='sm'
      padding={0}
      radius='md'
      withBorder
    >
      <Image
        src={influencer.cover}
        fallbackSrc='/cover-fallback.svg'
        style={{
          display: 'block',
        }}
      />

      <Group wrap='nowrap' align='stretch' gap={0}>
        <Avatar src={influencer.avatar} size={64} />

        <Stack gap='xs' p='md' style={{ flex: 1, minWidth: 0 }}>
          <Group justify='space-between' wrap='nowrap' gap='xs'>
            <Group gap='xs' wrap='nowrap' style={{ flex: 1, minWidth: 0 }}>
              <Text fw={600} lineClamp={1} style={{ flex: 1, minWidth: 0 }}>
                {localeName}
              </Text>
              <GenderEmoji gender={influencer.gender} />
              <RegionFlag region={influencer.region} />
            </Group>
            {actions && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {actions}
              </div>
            )}
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}
