import { Anchor, Avatar, Badge, Card, Group, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import type Influencer from '#types/Influencer';
import { getLocalizedName } from '#utils/localized';

interface InfluencerCardProps {
  influencer: Influencer;
  showAccounts?: boolean;
  actions?: ReactNode;
}

export default function InfluencerCard({
  influencer,
  showAccounts = false,
  actions,
}: InfluencerCardProps) {
  const { t } = useTranslation();

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
              {getLocalizedName(influencer.name, t('influencer.unknown'))}
            </Anchor>
          </Group>
          {actions}
        </Group>
        <Text size='sm' c='dimmed'>
          @{influencer.slug}
        </Text>
        {showAccounts && influencer.accounts?.length > 0 && (
          <Group gap={4}>
            {influencer.accounts.map((a) =>
              a.url ? (
                <Anchor
                  key={a.id}
                  href={a.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  underline='never'
                >
                  <Badge variant='light' size='sm'>
                    {a.platform}: {a.username}
                  </Badge>
                </Anchor>
              ) : (
                <Badge key={a.id} variant='light' size='sm'>
                  {a.platform}: {a.username}
                </Badge>
              ),
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
}
