import {
  ActionIcon,
  Anchor,
  AspectRatio,
  Badge,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Modal,
  MultiSelect,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ArrowLeftIcon, LinkIcon, PlusIcon, TrashIcon, XIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'wouter';

import CommentList from '#components/CommentList';
import InfluencerCard from '#components/InfluencerCard';
import useAuthUser from '#hooks/useAuthUser';
import { getInfluencers } from '#services/influencer';
import {
  attachInfluencers,
  deletePost,
  detachInfluencer,
  getPost,
  getPostInfluencers,
} from '#services/post';
import type Influencer from '#types/Influencer';
import type Post from '#types/Post';
import { getInfluencerName } from '#utils/influencer';

export default function PostDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const [, navigate] = useLocation();
  const id = Number(params.id);

  const [authUser] = useAuthUser();
  const [post, setPost] = useState<Post | null>(null);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);

  const [attachOpened, { open: openAttach, close: closeAttach }] = useDisclosure(false);
  const [availableInfluencers, setAvailableInfluencers] = useState<Influencer[]>([]);
  const [selectedInfluencerIds, setSelectedInfluencerIds] = useState<string[]>([]);
  const [attaching, setAttaching] = useState(false);

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

  const handleOpenAttach = async () => {
    try {
      const res = await getInfluencers({ perPage: 100 });
      const linkedIds = new Set(influencers.map((inf) => inf.id));
      setAvailableInfluencers(res.data.filter((inf) => !linkedIds.has(inf.id)));
      setSelectedInfluencerIds([]);
    } catch {
      // ignore
    }
    openAttach();
  };

  const handleAttach = async () => {
    if (selectedInfluencerIds.length === 0) return;
    setAttaching(true);
    try {
      await attachInfluencers(id, selectedInfluencerIds.map(Number));
      await fetchInfluencers();
      closeAttach();
      setSelectedInfluencerIds([]);
    } catch {
      // ignore
    } finally {
      setAttaching(false);
    }
  };

  const handleDetach = async (influencerId: number) => {
    if (!window.confirm(t('post.detachInfluencerConfirm'))) return;
    try {
      await detachInfluencer(id, influencerId);
      await fetchInfluencers();
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

      <Group justify='space-between' mb='sm'>
        <Text fw={600} size='lg'>
          {t('post.influencers')} ({influencers.length})
        </Text>
        {canManageInfluencers && (
          <Button variant='light' leftSection={<PlusIcon size={16} />} onClick={handleOpenAttach}>
            {t('post.attachInfluencers')}
          </Button>
        )}
      </Group>
      {influencers.length === 0 ? (
        <Text c='dimmed'>{t('post.noInfluencers')}</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
          {influencers.map((influencer) => (
            <InfluencerCard
              key={influencer.id}
              influencer={influencer}
              actions={
                canManageInfluencers && (
                  <ActionIcon
                    variant='subtle'
                    color='red'
                    size='sm'
                    onClick={() => handleDetach(influencer.id)}
                  >
                    <XIcon size={14} />
                  </ActionIcon>
                )
              }
            />
          ))}
        </SimpleGrid>
      )}

      <Divider my='xl' />

      <Text fw={600} size='lg' mb='sm'>
        {t('comment.title')}
      </Text>
      <CommentList postId={id} />

      <Modal
        opened={attachOpened}
        onClose={closeAttach}
        title={t('post.attachInfluencers')}
        size='lg'
      >
        <Stack gap='md'>
          <MultiSelect
            data={availableInfluencers.map((inf) => ({
              value: String(inf.id),
              label: `${getInfluencerName(inf.name, t('influencer.unknown'))} (@${inf.slug})`,
            }))}
            value={selectedInfluencerIds}
            onChange={setSelectedInfluencerIds}
            placeholder={t('post.searchInfluencers')}
            searchable
            clearable
          />
          <Group justify='flex-end'>
            <Button variant='default' onClick={closeAttach}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleAttach}
              loading={attaching}
              disabled={selectedInfluencerIds.length === 0}
            >
              {t('post.attach')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
