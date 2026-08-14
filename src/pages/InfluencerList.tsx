import {
  ActionIcon,
  Button,
  Container,
  Group,
  Pagination,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
} from '@mantine/core';
import { PencilIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import InfluencerCard from '#components/InfluencerCard';
import { deleteInfluencer, getInfluencers } from '#services/influencer';
import type Influencer from '#types/Influencer';
import type { PaginationMeta } from '#types/Response';

export default function InfluencerListPage() {
  const { t } = useTranslation();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = async (p: number) => {
    setLoading(true);
    try {
      const res = await getInfluencers({ page: p, perPage: 12 });
      setInfluencers(res.data);
      setMeta(res.meta);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('influencer.deleteConfirm'))) return;
    try {
      await deleteInfluencer(id);
      setInfluencers((prev) => prev.filter((i) => i.id !== id));
    } catch {
      // ignore
    }
  };

  return (
    <Container size='lg' py='xl'>
      <Group justify='space-between' mb='lg'>
        <Title order={2}>{t('influencer.list')}</Title>
        <Button component={Link} href='/influencers/new' leftSection={<PlusIcon size={18} />}>
          {t('influencer.new')}
        </Button>
      </Group>

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
