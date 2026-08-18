import { Button, Group, Pagination, SimpleGrid, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PlusIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PostCard from '#components/PostCard';
import PostCreateModal from '#components/PostCreateModal';
import { deletePost, detachPost, getInfluencerPosts } from '#services/post';
import type Post from '#types/Post';
import type { PaginationMetadata } from '#types/Response';

const PER_PAGE = 12;

interface PostListProps {
  influencerId: number;
}

export default function PostList({ influencerId }: PostListProps) {
  const { t } = useTranslation();

  const [posts, setPosts] = useState<Post[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(
    async (targetPage: number) => {
      setLoading(true);
      try {
        let currentPage = targetPage;
        let res = await getInfluencerPosts(influencerId, { page: currentPage, perPage: PER_PAGE });
        // After a deletion the current page can become empty; fall back to the
        // last available page in that case.
        if (
          res.data.length === 0 &&
          res.metadata.lastPage > 0 &&
          currentPage > res.metadata.lastPage
        ) {
          currentPage = res.metadata.lastPage;
          res = await getInfluencerPosts(influencerId, { page: currentPage, perPage: PER_PAGE });
        }
        setPosts(res.data);
        setMetadata(res.metadata);
        setPage(currentPage);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    },
    [influencerId],
  );

  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  // Create post modal
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);

  const handleDetach = async (postId: number) => {
    if (!window.confirm(t('influencer.detachConfirm'))) return;
    try {
      await detachPost(influencerId, postId);
      await loadPosts(page);
    } catch {
      // ignore
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm(t('influencer.deletePostConfirm'))) return;
    try {
      await deletePost(postId);
      await loadPosts(page);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <Group justify='space-between' mb='sm'>
        <Text fw={600} size='lg'>
          {t('influencer.posts')} ({metadata?.total ?? posts.length})
        </Text>
        <Group gap='xs'>
          <Button variant='light' leftSection={<PlusIcon size={16} />} onClick={openCreate}>
            {t('influencer.createPost')}
          </Button>
        </Group>
      </Group>

      {loading && posts.length === 0 ? (
        <Text c='dimmed' ta='center' py='xl'>
          {t('common.loading')}
        </Text>
      ) : posts.length === 0 ? (
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

      {metadata && metadata.lastPage > 1 && (
        <Group justify='center' mt='md'>
          <Pagination value={page} onChange={(p) => loadPosts(p)} total={metadata.lastPage} />
        </Group>
      )}

      {/* Create Post Modal */}
      <PostCreateModal
        opened={createOpened}
        influencerId={influencerId}
        onClose={closeCreate}
        onCreated={() => loadPosts(page)}
      />
    </>
  );
}
