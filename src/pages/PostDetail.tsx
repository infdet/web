import {
  ActionIcon,
  Anchor,
  AspectRatio,
  Badge,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ArrowLeftIcon, LinkIcon, TrashIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'wouter';

import CommentList from '#components/CommentList';
import RelatedInfluencerList from '#components/RelatedInfluencerList';
import TagList from '#components/TagList';
import useAuthUser from '#hooks/useAuthUser';
import { deletePost, getPost } from '#services/post';
import { attachPostTags, detachPostTag } from '#services/tag';
import type Post from '#types/Post';

export default function PostDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const [, navigate] = useLocation();
  const id = Number(params.id);

  const [authUser] = useAuthUser();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const canManageInfluencers = authUser?.role === 'editor' || authUser?.role === 'admin';

  const fetchPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getPost(id);
      setPost(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDelete = async () => {
    if (!window.confirm(t('post.deleteConfirm'))) return;
    try {
      await deletePost(id);
      navigate('/influencers');
    } catch {
      // ignore
    }
  };

  const handleAttachTags = async (tagIds: number[]) => {
    await attachPostTags(id, tagIds);
    await fetchPost();
  };

  const handleDetachTag = async (tagId: number) => {
    await detachPostTag(id, tagId);
    setPost((prev) =>
      prev ? { ...prev, tags: (prev.tags ?? []).filter((tag) => tag.id !== tagId) } : prev,
    );
  };

  if (loading) {
    return (
      <Container size='lg' py='xl'>
        <Group justify='center'>
          <Loader />
        </Group>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container size='lg' py='xl'>
        <Text c='dimmed'>{t('post.notFound')}</Text>
      </Container>
    );
  }

  return (
    <Container size='lg' py='xl'>
      <Group mb='xl'>
        <ActionIcon component={Link} href='/influencers' variant='subtle'>
          <ArrowLeftIcon size={20} />
        </ActionIcon>
        <Title order={2}>{t('post.title')}</Title>
        <Badge variant='light'>{t(`platform.${post.platform}`)}</Badge>
        <Badge variant='outline'>{t(`postType.${post.type}`)}</Badge>
        {authUser && (
          <ActionIcon variant='subtle' color='red' onClick={handleDelete}>
            <TrashIcon size={18} />
          </ActionIcon>
        )}
      </Group>

      <Paper withBorder radius='md' p='md'>
        {post.embedUrl ? (
          <AspectRatio ratio={16 / 9}>
            <iframe
              src={post.embedUrl}
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
      </Paper>

      <Divider my='xl' />

      <Stack gap='sm'>
        <Group justify='space-between'>
          <Text fw={600}>{t('post.postTitle')}</Text>
          <Text c='dimmed'>{post.title ?? '—'}</Text>
        </Group>
        <Group justify='space-between'>
          <Text fw={600}>{t('post.viewCount')}</Text>
          <Text c='dimmed'>{post.viewCount?.toLocaleString() ?? '—'}</Text>
        </Group>
        <Group justify='space-between'>
          <Text fw={600}>{t('post.likeCount')}</Text>
          <Text c='dimmed'>{post.likeCount?.toLocaleString() ?? '—'}</Text>
        </Group>
        <Group justify='space-between'>
          <Text fw={600}>{t('post.externalId')}</Text>
          <Text c='dimmed'>{post.externalId}</Text>
        </Group>
        <Group justify='space-between'>
          <Text fw={600}>{t('post.externalUrl')}</Text>
          <Anchor href={post.externalUrl} target='_blank' rel='noreferrer'>
            <LinkIcon size={14} style={{ marginRight: 4 }} />
            {t('influencer.link')}
          </Anchor>
        </Group>
        <Group justify='space-between'>
          <Text fw={600}>{t('post.createdAt')}</Text>
          <Text c='dimmed'>{new Date(post.createdAt).toLocaleString()}</Text>
        </Group>
      </Stack>

      <Divider my='xl' />

      <Text fw={600} size='lg' mb='sm'>
        {t('tag.title')}
      </Text>
      <TagList
        tags={post.tags ?? []}
        showActions={canManageInfluencers}
        onAttach={handleAttachTags}
        onDetach={handleDetachTag}
      />

      <Divider my='xl' />

      <RelatedInfluencerList postId={id} canManage={canManageInfluencers} />

      <Divider my='xl' />

      <Text fw={600} size='lg' mb='sm'>
        {t('comment.title')}
      </Text>
      <CommentList postId={id} />
    </Container>
  );
}
