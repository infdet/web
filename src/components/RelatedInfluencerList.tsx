import { ActionIcon, Button, Group, Modal, Select, SimpleGrid, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PlusIcon, XIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import InfluencerCard from '#components/InfluencerCard';
import { getInfluencers } from '#services/influencer';
import { attachInfluencers, detachInfluencer, getPostInfluencers } from '#services/post';
import type Influencer from '#types/Influencer';
import { getLocalizedName } from '#utils/localized';

interface RelatedInfluencerListProps {
  postId: number;
  canManage: boolean;
}

export default function RelatedInfluencerList({ postId, canManage }: RelatedInfluencerListProps) {
  const { t } = useTranslation();

  const [influencers, setInfluencers] = useState<Influencer[]>([]);

  const [attachOpened, { open: openAttach, close: closeAttach }] = useDisclosure(false);
  const [availableInfluencers, setAvailableInfluencers] = useState<Influencer[]>([]);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);
  const [attaching, setAttaching] = useState(false);

  const fetchInfluencers = useCallback(async () => {
    if (!postId) return;
    try {
      const data = await getPostInfluencers(postId);
      setInfluencers(data);
    } catch {
      // ignore
    }
  }, [postId]);

  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);

  const handleOpenAttach = async () => {
    try {
      const res = await getInfluencers({ perPage: 100 });
      const linkedIds = new Set(influencers.map((inf) => inf.id));
      setAvailableInfluencers(res.data.filter((inf) => !linkedIds.has(inf.id)));
      setSelectedInfluencerId(null);
    } catch {
      // ignore
    }
    openAttach();
  };

  const handleAttach = async () => {
    if (!selectedInfluencerId) return;
    setAttaching(true);
    try {
      await attachInfluencers(postId, Number(selectedInfluencerId));
      await fetchInfluencers();
      closeAttach();
      setSelectedInfluencerId(null);
    } catch {
      // ignore
    } finally {
      setAttaching(false);
    }
  };

  const handleDetach = async (influencerId: number) => {
    if (!window.confirm(t('post.detachInfluencerConfirm'))) return;
    try {
      await detachInfluencer(postId, influencerId);
      await fetchInfluencers();
    } catch {
      // ignore
    }
  };

  return (
    <>
      <Group justify='space-between' mb='sm'>
        <Text fw={600} size='lg'>
          {t('post.influencers')} ({influencers.length})
        </Text>
        {canManage && (
          <Button variant='light' leftSection={<PlusIcon size={16} />} onClick={handleOpenAttach}>
            {t('post.attachInfluencers')}
          </Button>
        )}
      </Group>
      {influencers.length === 0 ? (
        <Text c='dimmed'>{t('post.noInfluencers')}</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing='md'>
          {influencers.map((influencer) => (
            <InfluencerCard
              key={influencer.id}
              influencer={influencer}
              actions={
                canManage && (
                  <ActionIcon
                    variant='subtle'
                    color='red'
                    size='sm'
                    onClick={() => handleDetach(influencer.id)}
                  >
                    <XIcon size={14} />
                  </ActionIcon>
                )
              }
            />
          ))}
        </SimpleGrid>
      )}

      <Modal
        opened={attachOpened}
        onClose={closeAttach}
        title={t('post.attachInfluencers')}
        size='lg'
      >
        <Stack gap='md'>
          <Select
            data={availableInfluencers.map((inf) => ({
              value: String(inf.id),
              label: `${getLocalizedName(inf.name, t('influencer.unknown'))} (@${inf.slug})`,
            }))}
            value={selectedInfluencerId}
            onChange={setSelectedInfluencerId}
            placeholder={t('post.searchInfluencers')}
            searchable
            clearable
          />
          <Group justify='flex-end'>
            <Button variant='default' onClick={closeAttach}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleAttach} loading={attaching} disabled={!selectedInfluencerId}>
              {t('post.attach')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
