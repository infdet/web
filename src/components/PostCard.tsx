import { ActionIcon, Anchor, AspectRatio, Badge, Card, Group, Stack, Text } from '@mantine/core';
import { LinkIcon, TrashIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import type Post from '#types/Post';
import type { PostPlatform } from '#types/Post';

/** Embed URL builders for platforms that can be rendered inside an iframe. */
const EMBED_URL_BUILDERS: Partial<Record<PostPlatform, (id: string) => string>> = {
  youtube: (id) => `https://www.youtube.com/embed/${id}`,
  bilibili: (id) => `https://player.bilibili.com/player.html?bvid=${id}&autoplay=0`,
};

function getEmbedUrl(post: Post): string | null {
  if (post.type !== 'video' || !post.externalId) return null;
  const builder = EMBED_URL_BUILDERS[post.platform];
  if (!builder) return null;
  return builder(post.externalId);
}

interface PostCardProps {
  post: Post;
  onDetach: (postId: number) => void;
  onDelete: (postId: number) => void;
}

export default function PostCard({ post, onDetach, onDelete }: PostCardProps) {
  const { t } = useTranslation();
  const embedUrl = getEmbedUrl(post);

  return (
    <Card shadow='sm' padding='md' radius='md' withBorder>
      <Stack gap='sm'>
        <Group justify='space-between' wrap='nowrap'>
          <Group gap='xs' wrap='nowrap'>
            <Badge variant='light' size='sm'>
              {t(`platform.${post.platform}`)}
            </Badge>
            <Badge variant='outline' size='sm'>
              {t(`postType.${post.type}`)}
            </Badge>
          </Group>
          <Group gap={4} wrap='nowrap'>
            <ActionIcon variant='subtle' color='orange' size='sm' onClick={() => onDetach(post.id)}>
              <TrashIcon size={14} />
            </ActionIcon>
            <ActionIcon variant='subtle' color='red' size='sm' onClick={() => onDelete(post.id)}>
              <TrashIcon size={14} />
            </ActionIcon>
          </Group>
        </Group>

        {embedUrl ? (
          <AspectRatio ratio={16 / 9}>
            <iframe
              src={embedUrl}
              title={`${post.platform} ${post.externalId}`}
              allowFullScreen
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              style={{ border: 0 }}
            />
          </AspectRatio>
        ) : (
          <AspectRatio ratio={16 / 9}>
            <Stack gap={4} align='center' justify='center'>
              <Text size='sm' fw={600} c='dimmed'>
                {t(`platform.${post.platform}`)}
              </Text>
              <Text size='xs' c='dimmed'>
                {t(`postType.${post.type}`)}
              </Text>
            </Stack>
          </AspectRatio>
        )}

        <Group justify='space-between' wrap='nowrap' gap='xs'>
          <Text size='xs' c='dimmed' truncate style={{ flex: 1 }}>
            {post.externalId}
          </Text>
          <Anchor href={post.url} target='_blank' size='sm' rel='noreferrer'>
            <LinkIcon size={14} style={{ marginRight: 4 }} />
            {t('influencer.link')}
          </Anchor>
        </Group>
      </Stack>
    </Card>
  );
}
