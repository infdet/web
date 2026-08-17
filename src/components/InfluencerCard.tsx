import { Avatar, Card, Group, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import GenderEmoji from '#components/GenderEmoji';
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
      radius='md'
      padding='xs'
      withBorder
    >
      <Group wrap='nowrap' align='stretch' gap='xs'>
        <Avatar src={influencer.avatar} size={64} />

        <Stack gap='xs' style={{ flex: 1, minWidth: 0 }}>
          <Group justify='space-between' wrap='nowrap' gap='xs'>
            <Text fw={600} lineClamp={1} style={{ flex: 1, minWidth: 0 }}>
              {localeName}
            </Text>
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
          <Group>
            <GenderEmoji gender={influencer.gender} />
            <RegionFlag region={influencer.region} />
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}
