import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Loader,
  Pagination,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { PencilIcon, TrashIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useAuthUser from '#hooks/useAuthUser';
import { createComment, deleteComment, getComments, updateComment } from '#services/comment';
import type Comment from '#types/Comment';
import type { PaginationMetadata } from '#types/Response';

const PER_PAGE = 20;

interface CommentListProps {
  postId: number;
}

export default function CommentList({ postId }: CommentListProps) {
  const { t } = useTranslation();
  const [authUser] = useAuthUser();

  const [comments, setComments] = useState<Comment[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingBody, setEditingBody] = useState('');

  const loadComments = useCallback(
    async (targetPage: number) => {
      setLoading(true);
      try {
        const res = await getComments(postId, { page: targetPage, perPage: PER_PAGE });
        setComments(res.data);
        setMetadata(res.metadata);
        setPage(targetPage);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    },
    [postId],
  );

  useEffect(() => {
    loadComments(1);
  }, [loadComments]);

  const canModify = (comment: Comment) =>
    !!authUser && (comment.userId === authUser.id || authUser.role === 'admin');

  const handleSubmit = async () => {
    const value = body.trim();
    if (!value) return;
    setSubmitting(true);
    try {
      await createComment(postId, value);
      setBody('');
      await loadComments(page);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditingBody(comment.body);
  };

  const handleSaveEdit = async (commentId: number) => {
    const value = editingBody.trim();
    if (!value) return;
    try {
      await updateComment(postId, commentId, value);
      setEditingId(null);
      await loadComments(page);
    } catch {
      // ignore
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm(t('comment.deleteConfirm'))) return;
    try {
      await deleteComment(postId, commentId);
      await loadComments(page);
    } catch {
      // ignore
    }
  };

  return (
    <Stack gap='md'>
      {authUser && (
        <Stack gap='xs'>
          <Textarea
            placeholder={t('comment.placeholder')}
            minRows={2}
            autosize
            value={body}
            onChange={(e) => setBody(e.currentTarget.value)}
          />
          <Group justify='flex-end'>
            <Button size='sm' loading={submitting} onClick={handleSubmit}>
              {t('comment.submit')}
            </Button>
          </Group>
        </Stack>
      )}

      {loading && comments.length === 0 ? (
        <Group justify='center'>
          <Loader size='sm' />
        </Group>
      ) : comments.length === 0 ? (
        <Text c='dimmed'>{t('comment.empty')}</Text>
      ) : (
        <Stack gap='sm'>
          {comments.map((comment) => (
            <Stack key={comment.id} gap={4}>
              <Group justify='space-between' wrap='nowrap'>
                <Text size='sm' fw={600}>
                  {comment.user?.name ?? t('comment.anonymous')}
                </Text>
                <Text size='xs' c='dimmed'>
                  {new Date(comment.createdAt).toLocaleString()}
                </Text>
              </Group>

              {editingId === comment.id ? (
                <Textarea
                  value={editingBody}
                  onChange={(e) => setEditingBody(e.currentTarget.value)}
                  minRows={2}
                  autosize
                />
              ) : (
                <Text size='sm' style={{ whiteSpace: 'pre-wrap' }}>
                  {comment.body}
                </Text>
              )}

              {canModify(comment) && (
                <Group gap={4}>
                  {editingId === comment.id ? (
                    <>
                      <Button size='xs' variant='light' onClick={() => handleSaveEdit(comment.id)}>
                        {t('common.save')}
                      </Button>
                      <Button size='xs' variant='subtle' onClick={() => setEditingId(null)}>
                        {t('common.cancel')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <ActionIcon
                        size='sm'
                        variant='subtle'
                        color='blue'
                        onClick={() => handleStartEdit(comment)}
                      >
                        <PencilIcon size={14} />
                      </ActionIcon>
                      <ActionIcon
                        size='sm'
                        variant='subtle'
                        color='red'
                        onClick={() => handleDelete(comment.id)}
                      >
                        <TrashIcon size={14} />
                      </ActionIcon>
                    </>
                  )}
                </Group>
              )}
              <Divider />
            </Stack>
          ))}
        </Stack>
      )}

      {metadata && metadata.lastPage > 1 && (
        <Pagination total={metadata.lastPage} value={page} onChange={loadComments} />
      )}
    </Stack>
  );
}
