import { Button, Container, Group, SimpleGrid, Skeleton, Text, Title } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import TagCard from '#components/TagCard';
import TagFormModal from '#components/TagFormModal';
import useAuthUser from '#hooks/useAuthUser';
import { createTag, deleteTag, getTags, updateTag, uploadTagIcon } from '#services/tag';
import type Tag from '#types/Tag';

export default function TagsPage() {
  const { t } = useTranslation();
  const [authUser] = useAuthUser();
  const canManageTags = authUser?.role === 'editor' || authUser?.role === 'admin';
  const canDeleteTags = authUser?.role === 'admin';
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTags({ perPage: 100 });
      setTags(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const openAdd = () => {
    setEditing(null);
    setError('');
    setModalOpened(true);
  };

  const openEdit = (tag: Tag) => {
    setEditing(tag);
    setError('');
    setModalOpened(true);
  };

  const closeModal = () => {
    setModalOpened(false);
  };

  const handleDelete = async (tag: Tag) => {
    if (!window.confirm(t('tag.deleteConfirm'))) return;
    setError('');
    try {
      await deleteTag(tag.id);
      setTags((prev) => prev.filter((x) => x.id !== tag.id));
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          t('tag.saveFailed'),
      );
    }
  };

  const handleUploadIcon = async (tag: Tag, file: File | null) => {
    if (!file) return;
    setUploadingId(tag.id);
    try {
      const updated = await uploadTagIcon(tag.id, file);
      setTags((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch {
      // ignore
    } finally {
      setUploadingId(null);
    }
  };

  const handleSubmit = async (data: {
    slug: string;
    name: Record<string, string>;
    forInfluencer: boolean;
  }) => {
    if (editing) {
      const updated = await updateTag(editing.id, data);
      setTags((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } else {
      const created = await createTag(data);
      setTags((prev) => [...prev, created]);
    }
  };

  return (
    <Container size='lg' py='xl'>
      <Group justify='space-between' mb='lg'>
        <Title order={2}>{t('tag.list')}</Title>
        {canManageTags && (
          <Button leftSection={<PlusIcon size={18} />} onClick={openAdd}>
            {t('tag.new')}
          </Button>
        )}
      </Group>

      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={120} />
          ))}
        </SimpleGrid>
      ) : tags.length === 0 ? (
        <Text c='dimmed' ta='center' py='xl'>
          {t('tag.noTags')}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {tags.map((tag) => (
            <TagCard
              key={tag.id}
              tag={tag}
              canEdit={canManageTags}
              canDelete={canDeleteTags}
              uploading={uploadingId === tag.id}
              onEdit={openEdit}
              onDelete={handleDelete}
              onUploadIcon={handleUploadIcon}
            />
          ))}
        </SimpleGrid>
      )}

      {error && (
        <Text c='red' size='sm' mt='md'>
          {error}
        </Text>
      )}

      <TagFormModal
        opened={modalOpened}
        title={editing ? t('tag.edit') : t('tag.new')}
        initialValues={editing ?? undefined}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
