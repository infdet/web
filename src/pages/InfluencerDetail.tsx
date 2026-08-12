import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Container,
  FileInput,
  Group,
  Image,
  Loader,
  Modal,
  MultiSelect,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ArrowLeftIcon,
  CameraIcon,
  ImageIcon,
  LinkIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'wouter';

import useAuthUser from '#hooks/useAuthUser';
import { getInfluencer, uploadAvatar, uploadCover } from '#services/influencer';
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
  const { t } = useTranslation();
  const params = useParams();
  const id = Number(params.id);

  const [authUser] = useAuthUser();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

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
    name.en || name.zh || Object.values(name)[0] || t('influencer.unknown');

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
    if (!window.confirm(t('influencer.detachConfirm'))) return;
    try {
      await detachPost(id, postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      // ignore
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm(t('influencer.deletePostConfirm'))) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      // ignore
    }
  };

  const handleUploadAvatar = async (file: File | null) => {
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const updated = await uploadAvatar(id, file);
      setInfluencer(updated);
    } catch {
      // ignore
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUploadCover = async (file: File | null) => {
    if (!file) return;
    setUploadingCover(true);
    try {
      const updated = await uploadCover(id, file);
      setInfluencer(updated);
    } catch {
      // ignore
    } finally {
      setUploadingCover(false);
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
        <Text c='dimmed'>{t('influencer.notFound')}</Text>
      </Container>
    );
  }

  return (
    <Container size='lg' py='xl'>
      <Group mb='md'>
        <ActionIcon component={Link} href='/influencers' variant='subtle'>
          <ArrowLeftIcon size={20} />
        </ActionIcon>
        <Title order={2}>{displayName(influencer.name)}</Title>
        <Badge variant='light'>@{influencer.slug}</Badge>
        {authUser && (
          <ActionIcon
            component={Link}
            href={`/influencers/${influencer.id}/edit`}
            variant='subtle'
            color='blue'
          >
            <PencilIcon size={18} />
          </ActionIcon>
        )}
      </Group>

      <Tabs defaultValue='info'>
        <Tabs.List>
          <Tabs.Tab value='info' leftSection={<ImageIcon size={16} />}>
            {t('influencer.info')}
          </Tabs.Tab>
          <Tabs.Tab value='posts'>
            {t('influencer.posts')} ({posts.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='info' pt='md'>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='lg'>
            <Paper withBorder p='md' radius='md'>
              <Text fw={600} mb='sm'>
                {t('influencer.avatar')}
              </Text>
              {influencer.avatar ? (
                <Image
                  src={influencer.avatar}
                  alt='Avatar'
                  width={120}
                  height={120}
                  radius='md'
                  fit='cover'
                />
              ) : (
                <Paper
                  bg='gray.1'
                  w={120}
                  h={120}
                  radius='md'
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <CameraIcon size={32} color='var(--mantine-color-gray-5)' />
                </Paper>
              )}
              {authUser && (
                <FileInput
                  mt='sm'
                  size='sm'
                  placeholder={t('influencer.uploadAvatar')}
                  accept='image/*'
                  leftSection={<ImageIcon size={14} />}
                  value={null}
                  onChange={handleUploadAvatar}
                  disabled={uploadingAvatar}
                  clearable={false}
                />
              )}
            </Paper>

            <Paper withBorder p='md' radius='md'>
              <Text fw={600} mb='sm'>
                {t('influencer.cover')}
              </Text>
              {influencer.cover ? (
                <Image
                  src={influencer.cover}
                  alt='Cover'
                  width={180}
                  height={320}
                  radius='md'
                  fit='cover'
                />
              ) : (
                <Paper
                  bg='gray.1'
                  w={180}
                  h={320}
                  radius='md'
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ImageIcon size={32} color='var(--mantine-color-gray-5)' />
                </Paper>
              )}
              {authUser && (
                <FileInput
                  mt='sm'
                  size='sm'
                  placeholder={t('influencer.uploadCover')}
                  accept='image/*'
                  leftSection={<ImageIcon size={14} />}
                  value={null}
                  onChange={handleUploadCover}
                  disabled={uploadingCover}
                  clearable={false}
                />
              )}
            </Paper>
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='lg' mt='lg'>
            <Stack gap='xs'>
              <Text fw={600}>{t('influencer.accounts')}</Text>
              {influencer.accounts?.map((a) => (
                <Badge key={a.id} variant='light' size='lg'>
                  {a.platform}: {a.username}
                </Badge>
              ))}
              {(!influencer.accounts || influencer.accounts.length === 0) && (
                <Text c='dimmed' size='sm'>
                  {t('influencer.noAccounts')}
                </Text>
              )}
            </Stack>

            <Stack gap='xs'>
              <Text fw={600}>{t('influencer.name')}</Text>
              {Object.entries(influencer.name).map(([locale, name]) => (
                <Text key={locale} size='sm' c='dimmed'>
                  {locale}: {name}
                </Text>
              ))}
            </Stack>
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value='posts' pt='md'>
          <Group justify='flex-end' mb='sm'>
            <Button variant='light' leftSection={<PlusIcon size={16} />} onClick={handleOpenAttach}>
              {t('influencer.attachPosts')}
            </Button>
            <Button variant='light' leftSection={<PlusIcon size={16} />} onClick={openCreate}>
              {t('influencer.createPost')}
            </Button>
          </Group>

          {posts.length === 0 ? (
            <Text c='dimmed' ta='center' py='xl'>
              {t('influencer.noPosts')}
            </Text>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('influencer.platform')}</Table.Th>
                  <Table.Th>{t('influencer.type')}</Table.Th>
                  <Table.Th>{t('influencer.externalId')}</Table.Th>
                  <Table.Th>{t('influencer.url')}</Table.Th>
                  <Table.Th w={100}>{t('influencer.actions')}</Table.Th>
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
                        {t('influencer.link')}
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
                          <TrashIcon size={14} />
                        </ActionIcon>
                        <ActionIcon
                          variant='subtle'
                          color='red'
                          size='sm'
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <TrashIcon size={14} />
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
    </Container>
  );
}
