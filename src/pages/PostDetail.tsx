import {
  ActionIcon,
  Anchor,
  AspectRatio,
  Badge,
  Card,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { ArrowLeftIcon, LinkIcon, TrashIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'wouter';

import useAuthUser from '#hooks/useAuthUser';
import { deletePost, getPost, getPostInfluencers } from '#services/post';
import type Influencer from '#types/Influencer';
import type Post from '#types/Post';

export default function PostDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const [, navigate] = useLocation();
  const id = Number(params.id);

  const [authUser] = useAuthUser();
  const [post, setPost] = useState<Post | null>(null);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);

  const displayName = (name: Record<string, string>) =>
    name.en || name.zh || Object.values(name)[0] || t('influencer.unknown');

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

  const fetchInfluencers = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getPostInfluencers(id);
      setInfluencers(data);
    } catch {
      // ignore
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchInfluencers();
  }, [fetchPost, fetchInfluencers]);

  const handleDelete = async () => {
    if (!window.confirm(t('post.deleteConfirm'))) return;
    try {
      await deletePost(id);
      navigate('/influencers');
    } catch {
      // ignore
    }
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
        {t('post.influencers')} ({influencers.length})
      </Text>
      {influencers.length === 0 ? (
        <Text c='dimmed'>{t('post.noInfluencers')}</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
          {influencers.map((influencer) => (
            <Card key={influencer.id} shadow='sm' padding='md' radius='md' withBorder>
              <Stack gap='xs'>
                <Anchor
                  component={Link}
                  href={`/influencers/${influencer.id}`}
                  fw={600}
                  lineClamp={1}
                >
                  {displayName(influencer.name)}
                </Anchor>
                <Text size='sm' c='dimmed'>
                  @{influencer.slug}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
