import { Badge, Button, Group, Modal, MultiSelect, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PlusIcon, XIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getTags } from '#services/tag';
import type Tag from '#types/Tag';
import { getLocalizedName } from '#utils/localized';

interface TagListProps {
  tags: Tag[];
  showActions: boolean;
  onAttach: (tagIds: number[]) => Promise<void>;
  onDetach: (tagId: number) => Promise<void>;
}

export default function TagList({ tags, showActions, onAttach, onDetach }: TagListProps) {
  const { t } = useTranslation();

  const [attachOpened, { open: openAttach, close: closeAttach }] = useDisclosure(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [attaching, setAttaching] = useState(false);

  const handleOpenAttach = async () => {
    try {
      const res = await getTags({ perPage: 100 });
      const linkedIds = new Set(tags.map((tag) => tag.id));
      setAvailableTags(res.data.filter((tag) => !linkedIds.has(tag.id)));
      setSelectedIds([]);
    } catch {
      // ignore
    }
    openAttach();
  };

  const handleAttach = async () => {
    if (selectedIds.length === 0) return;
    setAttaching(true);
    try {
      await onAttach(selectedIds.map(Number));
      closeAttach();
      setSelectedIds([]);
    } catch {
      // ignore
    } finally {
      setAttaching(false);
    }
  };

  const handleDetach = async (tag: Tag) => {
    if (!window.confirm(t('tag.detachConfirm'))) return;
    try {
      await onDetach(tag.id);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <Group justify='space-between'>
        <Text fw={600}>{t('tag.title')}</Text>
        {showActions && (
          <Button
            size='xs'
            variant='light'
            leftSection={<PlusIcon size={14} />}
            onClick={handleOpenAttach}
          >
            {t('tag.attach')}
          </Button>
        )}
      </Group>

      {tags.length > 0 ? (
        <Group gap='xs'>
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant='light'
              size='lg'
              radius='xl'
              rightSection={
                showActions ? (
                  <XIcon
                    size={12}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDetach(tag)}
                  />
                ) : undefined
              }
            >
              {getLocalizedName(tag.name, t('tag.unknown'))}
            </Badge>
          ))}
        </Group>
      ) : (
        <Text c='dimmed' size='sm'>
          {t('tag.noAttached')}
        </Text>
      )}

      <Modal opened={attachOpened} onClose={closeAttach} title={t('tag.attach')} size='lg'>
        <Stack gap='md'>
          <MultiSelect
            data={availableTags.map((tag) => ({
              value: String(tag.id),
              label: `${getLocalizedName(tag.name, t('tag.unknown'))} (@${tag.slug})`,
            }))}
            value={selectedIds}
            onChange={setSelectedIds}
            placeholder={t('tag.searchTags')}
            searchable
            clearable
          />
          <Group justify='flex-end'>
            <Button variant='default' onClick={closeAttach}>
              {t('tag.cancel')}
            </Button>
            <Button onClick={handleAttach} loading={attaching} disabled={selectedIds.length === 0}>
              {t('tag.attach')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
