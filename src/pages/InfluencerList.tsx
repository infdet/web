import {
  ActionIcon,
  Button,
  Chip,
  Container,
  Group,
  Pagination,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
} from '@mantine/core';
import { PencilIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import InfluencerCard from '#components/InfluencerCard';
import { deleteInfluencer, getInfluencers } from '#services/influencer';
import { getTags } from '#services/tag';
import type Influencer from '#types/Influencer';
import type { PaginationMeta } from '#types/Response';
import type Tag from '#types/Tag';
import { getLocalizedName } from '#utils/localized';

export default function InfluencerListPage() {
  const { t } = useTranslation();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const fetchData = useCallback(async (p: number, tagIds: number[]) => {
    setLoading(true);
    try {
      const res = await getInfluencers({ page: p, perPage: 12, tagIds });
      setInfluencers(res.data);
      setMeta(res.meta);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(page, selectedTagIds);
  }, [page, selectedTagIds, fetchData]);

  useEffect(() => {
    let cancelled = false;
    getTags({ perPage: 100 })
      .then((res) => {
        if (!cancelled) setAvailableTags(res.data);
      })
      .catch(() => {
        // ignore
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('influencer.deleteConfirm'))) return;
    try {
      await deleteInfluencer(id);
      setInfluencers((prev) => prev.filter((i) => i.id !== id));
    } catch {
      // ignore
    }
  };

  const clearFilter = () => {
    setSelectedTagIds([]);
    setPage(1);
  };

  return (
    <Container size='lg' py='xl'>
      <Group justify='space-between' mb='lg'>
        <Title order={2}>{t('influencer.list')}</Title>
        <Button component={Link} href='/influencers/new' leftSection={<PlusIcon size={18} />}>
          {t('influencer.new')}
        </Button>
      </Group>

      {availableTags.length > 0 && (
        <Group gap='xs' mb='lg' align='center'>
          <Text size='sm' fw={500} c='dimmed'>
            {t('tag.filterByTag')}
          </Text>
          <Chip.Group
            multiple
            value={selectedTagIds.map(String)}
            onChange={(values) => {
              setSelectedTagIds(values.map(Number));
              setPage(1);
            }}
          >
            <Group gap='xs'>
              {availableTags.map((tag) => (
                <Chip key={tag.id} value={String(tag.id)} radius='xl'>
                  {getLocalizedName(tag.name, t('tag.unknown'))}
                </Chip>
              ))}
            </Group>
          </Chip.Group>
          {selectedTagIds.length > 0 && (
            <Button variant='subtle' size='xs' onClick={clearFilter}>
              {t('tag.clearFilter')}
            </Button>
          )}
        </Group>
      )}

      {loading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={140} />
          ))}
        </SimpleGrid>
      ) : influencers.length === 0 ? (
        <Text c='dimmed' ta='center' py='xl'>
          {t('influencer.noInfluencers')}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {influencers.map((influencer) => (
            <InfluencerCard
              key={influencer.id}
              influencer={influencer}
              showAccounts
              actions={
                <Group gap={4} wrap='nowrap'>
                  <ActionIcon
                    component={Link}
                    href={`/influencers/${influencer.id}/edit`}
                    variant='subtle'
                    color='blue'
                    size='sm'
                  >
                    <PencilIcon size={14} />
                  </ActionIcon>
                  <ActionIcon
                    variant='subtle'
                    color='red'
                    size='sm'
                    onClick={() => handleDelete(influencer.id)}
                  >
                    <TrashIcon size={14} />
                  </ActionIcon>
                </Group>
              }
            />
          ))}
        </SimpleGrid>
      )}

      {meta && meta.lastPage > 1 && (
        <Group justify='center' mt='lg'>
          <Pagination total={meta.lastPage} value={page} onChange={setPage} />
        </Group>
      )}
    </Container>
  );
}
