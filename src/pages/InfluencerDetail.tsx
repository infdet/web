import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Loader,
  Modal,
  MultiSelect,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ArrowLeft, Link as LinkIcon, Plus, Trash } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'wouter';

import { getInfluencer } from '#services/influencer';
import {
  attachPosts,
  createPost,
  deletePost,
  detachPost,
  getInfluencerPosts,
  getPosts,
} from '#services/post';
import type Influencer from '#types/Influencer';
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

export default function InfluencerDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

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

  const displayName = (name: Record<string, string>) =>
    name.en || name.zh || Object.values(name)[0] || 'Unknown';

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [inf, pts] = await Promise.all([getInfluencer(id), getInfluencerPosts(id)]);
      setInfluencer(inf);
      setPosts(pts);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleAttach = async () => {
    if (selectedPostIds.length === 0) return;
    setAttaching(true);
    try {
      await attachPosts(id, selectedPostIds.map(Number));
      await fetchDetail();
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
      await attachPosts(id, [created.id]);
      await fetchDetail();
      closeCreate();
      setNewPost({ platform: 'youtube', type: 'video', externalUrl: '', externalId: '' });
    } catch {
      // ignore
    } finally {
      setCreating(false);
    }
  };

  const handleDetach = async (postId: number) => {
    if (!window.confirm('Remove this post from influencer?')) return;
    try {
      await detachPost(id, postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      // ignore
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('Permanently delete this post?')) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
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

  if (!influencer) {
    return (
      <Container size='lg' py='xl'>
        <Text c='dimmed'>Influencer not found.</Text>
      </Container>
    );
  }

  return (
    <Container size='lg' py='xl'>
      <Group mb='md'>
        <ActionIcon component={Link} href='/influencers' variant='subtle'>
          <ArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>{displayName(influencer.name)}</Title>
        <Badge variant='light'>@{influencer.slug}</Badge>
      </Group>

      <Tabs defaultValue='posts'>
        <Tabs.List>
          <Tabs.Tab value='posts'>Posts ({posts.length})</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='posts' pt='md'>
          <Group justify='flex-end' mb='sm'>
            <Button variant='light' leftSection={<Plus size={16} />} onClick={handleOpenAttach}>
              Attach Posts
            </Button>
            <Button variant='light' leftSection={<Plus size={16} />} onClick={openCreate}>
              Create Post
            </Button>
          </Group>

          {posts.length === 0 ? (
            <Text c='dimmed' ta='center' py='xl'>
              No posts yet.
            </Text>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Platform</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>External ID</Table.Th>
                  <Table.Th>URL</Table.Th>
                  <Table.Th w={100}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {posts.map((post) => (
                  <Table.Tr key={post.id}>
                    <Table.Td>
                      <Badge variant='light' size='sm'>
                        {post.platform}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{post.type}</Table.Td>
                    <Table.Td>
                      <Text size='sm'>{post.externalId}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Anchor href={post.externalUrl} target='_blank' size='sm'>
                        <LinkIcon size={14} style={{ marginRight: 4 }} />
                        Link
                      </Anchor>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <ActionIcon
                          variant='subtle'
                          color='orange'
                          size='sm'
                          onClick={() => handleDetach(post.id)}
                        >
                          <Trash size={14} />
                        </ActionIcon>
                        <ActionIcon
                          variant='subtle'
                          color='red'
                          size='sm'
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash size={14} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Tabs.Panel>
      </Tabs>

      {/* Attach Posts Modal */}
      <Modal opened={attachOpened} onClose={closeAttach} title='Attach Existing Posts' size='lg'>
        <Stack gap='md'>
          <MultiSelect
            data={availablePosts.map((p) => ({
              value: String(p.id),
              label: `[${p.platform}] ${p.externalId} (${p.type})`,
            }))}
            value={selectedPostIds}
            onChange={setSelectedPostIds}
            placeholder='Search posts...'
            searchable
            clearable
          />
          <Group justify='flex-end'>
            <Button variant='default' onClick={closeAttach}>
              Cancel
            </Button>
            <Button
              onClick={handleAttach}
              loading={attaching}
              disabled={selectedPostIds.length === 0}
            >
              Attach
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Create Post Modal */}
      <Modal opened={createOpened} onClose={closeCreate} title='Create New Post' size='md'>
        <Stack gap='md'>
          <Select
            label='Platform'
            data={PLATFORM_OPTIONS}
            value={newPost.platform}
            onChange={(v) =>
              setNewPost((prev) => ({ ...prev, platform: (v as PostPlatform) || 'youtube' }))
            }
          />
          <Select
            label='Type'
            data={TYPE_OPTIONS}
            value={newPost.type}
            onChange={(v) => setNewPost((prev) => ({ ...prev, type: (v as PostType) || 'video' }))}
          />
          <TextInput
            label='External URL'
            placeholder='https://...'
            value={newPost.externalUrl}
            onChange={(e) => setNewPost((prev) => ({ ...prev, externalUrl: e.target.value }))}
          />
          <TextInput
            label='External ID'
            placeholder='e.g. video id'
            value={newPost.externalId}
            onChange={(e) => setNewPost((prev) => ({ ...prev, externalId: e.target.value }))}
          />
          <Group justify='flex-end'>
            <Button variant='default' onClick={closeCreate}>
              Cancel
            </Button>
            <Button onClick={handleCreate} loading={creating}>
              Create & Attach
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
