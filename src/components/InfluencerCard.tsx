import { Anchor, Avatar, Badge, Card, Flex, Group, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

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
    <Card shadow='sm' padding='md' radius='md' withBorder>
      <Stack gap='xs'>
        <Group justify='space-between' wrap='nowrap' gap='xs'>
          <Group gap='sm' wrap='nowrap' style={{ flex: 1, minWidth: 0 }}>
            <Avatar src={influencer.avatar ?? undefined} radius='xl' size='md' />
            <Anchor
              component={Link}
              href={`/influencers/${influencer.id}`}
              fw={600}
              lineClamp={1}
              style={{ flex: 1, minWidth: 0 }}
            >
              {localeName}
            </Anchor>
          </Group>
          {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
        </Group>

        <Group gap='xs'>
          {Object.entries(influencer.name)
            .filter(([locale, name]) => name !== localeName)
            .map(([locale, name]) => (
              <Flex key={locale} gap={4} wrap='nowrap' align='center'>
                <Badge variant='outline' size='xs' tt='uppercase'>
                  {locale}
                </Badge>
                <Text size='sm' c='dimmed' lineClamp={1}>
                  {name}
                </Text>
              </Flex>
            ))}
        </Group>
      </Stack>
    </Card>
  );
}
