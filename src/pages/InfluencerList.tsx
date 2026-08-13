import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Pagination,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { PencilIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import { deleteInfluencer, getInfluencers } from '#services/influencer';
import type Influencer from '#types/Influencer';
import type { PaginationMeta } from '#types/Pagination';

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

  const displayName = (name: Record<string, string>) => {
    return name.en || name.zh || Object.values(name)[0] || t('influencer.unknown');
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
            <Card key={influencer.id} shadow='sm' padding='md' radius='md' withBorder>
              <Stack gap='xs'>
                <Group justify='space-between' wrap='nowrap'>
                  <Anchor
                    component={Link}
                    href={`/influencers/${influencer.id}`}
                    fw={600}
                    lineClamp={1}
                  >
                    {displayName(influencer.name)}
                  </Anchor>
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
                </Group>
                <Text size='sm' c='dimmed'>
                  @{influencer.slug}
                </Text>
                <Group gap={4}>
                  {influencer.accounts?.map((a) => (
                    <Badge key={a.id} variant='light' size='sm'>
                      {a.platform}: {a.username}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            </Card>
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
