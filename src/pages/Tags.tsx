import { ActionIcon, Button, Container, Group, Loader, Table, Text, Title } from '@mantine/core';
import { PencilIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import TagFormModal from '#components/TagFormModal';
import { createTag, deleteTag, getTags, updateTag } from '#services/tag';
import type Tag from '#types/Tag';
import { getLocalizedName } from '#utils/localized';

export default function TagsPage() {
  const { t } = useTranslation();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);

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
    <Container size='md' py='xl'>
      <Group justify='space-between' mb='lg'>
        <Title order={2}>{t('tag.list')}</Title>
        <Button leftSection={<PlusIcon size={18} />} onClick={openAdd}>
          {t('tag.new')}
        </Button>
      </Group>

      {loading ? (
        <Group justify='center'>
          <Loader />
        </Group>
      ) : tags.length === 0 ? (
        <Text c='dimmed' ta='center' py='xl'>
          {t('tag.noTags')}
        </Text>
      ) : (
        <Table verticalSpacing='sm'>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('tag.slug')}</Table.Th>
              <Table.Th>{t('tag.name')}</Table.Th>
              <Table.Th>{t('tag.forInfluencer')}</Table.Th>
              <Table.Th w={100}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tags.map((tag) => (
              <Table.Tr key={tag.id}>
                <Table.Td>@{tag.slug}</Table.Td>
                <Table.Td>{getLocalizedName(tag.name, t('tag.unknown'))}</Table.Td>
                <Table.Td>{tag.forInfluencer ? '✓' : ''}</Table.Td>
                <Table.Td>
                  <Group gap={4} wrap='nowrap'>
                    <ActionIcon
                      variant='subtle'
                      color='blue'
                      size='sm'
                      onClick={() => openEdit(tag)}
                    >
                      <PencilIcon size={14} />
                    </ActionIcon>
                    <ActionIcon
                      variant='subtle'
                      color='red'
                      size='sm'
                      onClick={() => handleDelete(tag)}
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
