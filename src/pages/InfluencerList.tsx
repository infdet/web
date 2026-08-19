import {
  Button,
  Chip,
  Container,
  Group,
  Pagination,
  Select,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
} from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

import InfluencerCard from '#components/InfluencerCard';
import RegionSelect from '#components/RegionSelect';
import { getInfluencers } from '#services/influencer';
import { getTags } from '#services/tag';
import type Influencer from '#types/Influencer';
import type { PaginationMetadata } from '#types/Response';
import type Tag from '#types/Tag';
import { getLocalizedName } from '#utils/localized';

export default function InfluencerListPage() {
  const { t } = useTranslation();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const fetchData = useCallback(
    async (p: number, tagIds: number[], region: string | null, gender: string | null) => {
      setLoading(true);
      try {
        const res = await getInfluencers({ page: p, perPage: 24, tagIds, region, gender });
        setInfluencers(res.data);
        setMetadata(res.metadata);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchData(page, selectedTagIds, selectedRegion, selectedGender);
  }, [page, selectedTagIds, selectedRegion, selectedGender, fetchData]);

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

  const clearFilter = () => {
    setSelectedTagIds([]);
    setPage(1);
  };

  const clearGenderFilter = () => {
    setSelectedGender(null);
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

      <Group gap='xs' mb='lg' align='center'>
        <Text size='sm' fw={500} c='dimmed'>
          {t('influencer.filterByGender')}
        </Text>
        <Select
          size='sm'
          placeholder={t('influencer.genderPlaceholder')}
          value={selectedGender}
          onChange={(value) => {
            setSelectedGender(value);
            setPage(1);
          }}
          data={[
            { value: 'female', label: `♀️ ${t('influencer.genderFemale')}` },
            { value: 'male', label: `♂️ ${t('influencer.genderMale')}` },
            { value: 'other', label: `⚧️ ${t('influencer.genderOther')}` },
          ]}
          clearable
          w={150}
        />
      </Group>

      <Group gap='xs' mb='lg' align='center'>
        <Text size='sm' fw={500} c='dimmed'>
          {t('influencer.filterByRegion')}
        </Text>
        <RegionSelect
          placeholder={t('influencer.regionPlaceholder')}
          value={selectedRegion}
          onChange={(value) => {
            setSelectedRegion(value);
            setPage(1);
          }}
        />
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
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={140} />
          ))}
        </SimpleGrid>
      ) : influencers.length === 0 ? (
        <Text c='dimmed' ta='center' py='xl'>
          {t('influencer.noInfluencers')}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
          {influencers.map((influencer) => (
            <InfluencerCard key={influencer.id} influencer={influencer} />
          ))}
        </SimpleGrid>
      )}

      {metadata && metadata.lastPage > 1 && (
        <Group justify='center' mt='lg'>
          <Pagination total={metadata.lastPage} value={page} onChange={setPage} />
        </Group>
      )}
    </Container>
  );
}
