import {
  Button,
  Group,
  Modal,
  MultiSelect,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PlusIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PostCard from '#components/PostCard';
import { attachPosts, createPost, deletePost, detachPost, getPosts } from '#services/post';
import type Post from '#types/Post';
import type { PostFormData, PostPlatform, PostType } from '#types/Post';

const PLATFORM_OPTIONS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'bilibili', label: 'Bilibili' },
  { value: 'weibo', label: 'Weibo' },
  { value: 'douyin', label: 'Douyin' },
  { value: 'xiaohongshu', label: 'Xiaohongshu' },
];

const TYPE_OPTIONS = [
  { value: 'photo', label: 'Photo' },
  { value: 'video', label: 'Video' },
];

interface PostListProps {
  posts: Post[];
  influencerId: number;
  onRefresh: () => void;
}

export default function PostList({ posts, influencerId, onRefresh }: PostListProps) {
  const { t } = useTranslation();

  // Attach post modal
  const [attachOpened, { open: openAttach, close: closeAttach }] = useDisclosure(false);
  const [availablePosts, setAvailablePosts] = useState<Post[]>([]);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [attaching, setAttaching] = useState(false);

  // Create post modal
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [newPost, setNewPost] = useState<PostFormData>({
    platform: 'youtube',
    type: 'video',
    externalUrl: '',
    externalId: '',
  });
  const [creating, setCreating] = useState(false);

  const handleAttach = async () => {
    if (selectedPostIds.length === 0) return;
    setAttaching(true);
    try {
      await attachPosts(influencerId, selectedPostIds.map(Number));
      onRefresh();
      closeAttach();
      setSelectedPostIds([]);
    } catch {
      // ignore
    } finally {
      setAttaching(false);
    }
  };

  const handleOpenAttach = async () => {
    try {
      const res = await getPosts({ perPage: 100 });
      setAvailablePosts(res.data);
      setSelectedPostIds([]);
    } catch {
      // ignore
    }
    openAttach();
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const created = await createPost(newPost);
      await attachPosts(influencerId, [created.id]);
      onRefresh();
      closeCreate();
      setNewPost({ platform: 'youtube', type: 'video', externalUrl: '', externalId: '' });
    } catch {
      // ignore
    } finally {
      setCreating(false);
    }
  };

  const handleDetach = async (postId: number) => {
    if (!window.confirm(t('influencer.detachConfirm'))) return;
    try {
      await detachPost(influencerId, postId);
      onRefresh();
    } catch {
      // ignore
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm(t('influencer.deletePostConfirm'))) return;
    try {
      await deletePost(postId);
      onRefresh();
    } catch {
      // ignore
    }
  };

  return (
    <>
      <Group justify='space-between' mb='sm'>
        <Text fw={600} size='lg'>
          {t('influencer.posts')} ({posts.length})
        </Text>
        <Group gap='xs'>
          <Button variant='light' leftSection={<PlusIcon size={16} />} onClick={handleOpenAttach}>
            {t('influencer.attachPosts')}
          </Button>
          <Button variant='light' leftSection={<PlusIcon size={16} />} onClick={openCreate}>
            {t('influencer.createPost')}
          </Button>
        </Group>
      </Group>

      {posts.length === 0 ? (
        <Text c='dimmed' ta='center' py='xl'>
          {t('influencer.noPosts')}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDetach={handleDetach}
              onDelete={handleDeletePost}
            />
          ))}
        </SimpleGrid>
      )}

      {/* Attach Posts Modal */}
      <Modal
        opened={attachOpened}
        onClose={closeAttach}
        title={t('influencer.attachExistingPosts')}
        size='lg'
      >
        <Stack gap='md'>
          <MultiSelect
            data={availablePosts.map((p) => ({
              value: String(p.id),
              label: `[${p.platform}] ${p.externalId} (${p.type})`,
            }))}
            value={selectedPostIds}
            onChange={setSelectedPostIds}
            placeholder={t('influencer.searchPosts')}
            searchable
            clearable
          />
          <Group justify='flex-end'>
            <Button variant='default' onClick={closeAttach}>
              {t('influencer.cancel')}
            </Button>
            <Button
              onClick={handleAttach}
              loading={attaching}
              disabled={selectedPostIds.length === 0}
            >
              {t('influencer.attach')}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Create Post Modal */}
      <Modal
        opened={createOpened}
        onClose={closeCreate}
        title={t('influencer.createNewPost')}
        size='md'
      >
        <Stack gap='md'>
          <Select
            label={t('influencer.platform')}
            data={PLATFORM_OPTIONS}
            value={newPost.platform}
            onChange={(v) =>
              setNewPost((prev) => ({ ...prev, platform: (v as PostPlatform) || 'youtube' }))
            }
          />
          <Select
            label={t('influencer.type')}
            data={TYPE_OPTIONS}
            value={newPost.type}
            onChange={(v) => setNewPost((prev) => ({ ...prev, type: (v as PostType) || 'video' }))}
          />
          <TextInput
            label={t('influencer.externalUrl')}
            placeholder={t('influencer.externalUrlPlaceholder')}
            value={newPost.externalUrl}
            onChange={(e) => setNewPost((prev) => ({ ...prev, externalUrl: e.target.value }))}
          />
          <TextInput
            label={t('influencer.externalId')}
            placeholder={t('influencer.externalIdPlaceholder')}
            value={newPost.externalId}
            onChange={(e) => setNewPost((prev) => ({ ...prev, externalId: e.target.value }))}
          />
          <Group justify='flex-end'>
            <Button variant='default' onClick={closeCreate}>
              {t('influencer.cancel')}
            </Button>
            <Button onClick={handleCreate} loading={creating}>
              {t('influencer.createAndAttach')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
