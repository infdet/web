import { Container, Divider, Group, Loader, Text } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'wouter';

import InfluencerInfo from '#components/InfluencerInfo';
import PostList from '#components/PostList';
import { getInfluencer } from '#services/influencer';
import type Influencer from '#types/Influencer';

export default function InfluencerDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const idOrSlug = params.id || '';

  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    if (!idOrSlug) return;
    setLoading(true);
    try {
      const inf = await getInfluencer(idOrSlug);
      setInfluencer(inf);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [idOrSlug]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleInfluencerChanged = (updated: Influencer) => {
    setInfluencer(updated);
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
      <InfluencerInfo
        influencer={influencer}
        onInfluencerChanged={handleInfluencerChanged}
        onAccountsTagsChanged={fetchDetail}
      />

      <Divider my='xl' />

      <PostList influencerId={influencer!.id} />
    </Container>
  );
}
