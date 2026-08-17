import { Anchor, AspectRatio, Badge, Group, Paper, Stack, Text } from '@mantine/core';
import { LinkIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import type { PostPlatform, PostType } from '#types/Post';

interface PostPreviewProps {
  platform: PostPlatform;
  type: PostType;
  externalId: string;
  externalUrl: string;
  embedUrl: string | null;
}

export default function PostPreview({
  platform,
  type,
  externalId,
  externalUrl,
  embedUrl,
}: PostPreviewProps) {
  const { t } = useTranslation();

  return (
    <Paper withBorder radius='md' p='md'>
      <Stack gap='sm'>
        <Group gap='xs'>
          <Badge variant='light'>{t(`platform.${platform}`)}</Badge>
          <Badge variant='outline'>{t(`postType.${type}`)}</Badge>
        </Group>

        {embedUrl ? (
          <AspectRatio ratio={16 / 9}>
            <iframe
              src={embedUrl}
              title={`${platform} ${externalId}`}
              allowFullScreen
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              style={{ border: 0 }}
            />
          </AspectRatio>
        ) : (
          <AspectRatio ratio={16 / 9}>
            <Stack gap={4} align='center' justify='center'>
              <Text size='sm' fw={600} c='dimmed'>
                {t(`platform.${platform}`)}
              </Text>
              <Text size='xs' c='dimmed'>
                {t(`postType.${type}`)}
              </Text>
            </Stack>
          </AspectRatio>
        )}

        <Group justify='space-between' wrap='nowrap' gap='xs'>
          <Text size='xs' c='dimmed' truncate style={{ flex: 1 }}>
            {externalId}
          </Text>
          <Anchor href={externalUrl} target='_blank' size='sm' rel='noreferrer'>
            <LinkIcon size={14} style={{ marginRight: 4 }} />
            {t('influencer.link')}
          </Anchor>
        </Group>
      </Stack>
    </Paper>
  );
}
