import { Container, Divider, Group, Loader, Text } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'wouter';

import InfluencerInfo from '#components/InfluencerInfo';
import PostList from '#components/PostList';
import useAuthUser from '#hooks/useAuthUser';
import { createAccount, deleteAccount, updateAccount } from '#services/account';
import { getInfluencer } from '#services/influencer';
import { attachTags, detachTag } from '#services/tag';
import type Influencer from '#types/Influencer';

export default function InfluencerDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const idOrSlug = params.id || '';

  const [authUser] = useAuthUser();
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

  const handleCreateAccount = async (data: { platform: string; username: string }) => {
    const account = await createAccount(influencer!.id, data);
    setInfluencer((prev) =>
      prev ? { ...prev, accounts: [...(prev.accounts ?? []), account] } : prev,
    );
  };

  const handleUpdateAccount = async (
    accountId: number,
    data: { platform: string; username: string },
  ) => {
    const account = await updateAccount(influencer!.id, accountId, data);
    setInfluencer((prev) =>
      prev
        ? {
            ...prev,
            accounts: (prev.accounts ?? []).map((a) => (a.id === accountId ? account : a)),
          }
        : prev,
    );
  };

  const handleDeleteAccount = async (accountId: number) => {
    await deleteAccount(influencer!.id, accountId);
    setInfluencer((prev) =>
      prev ? { ...prev, accounts: (prev.accounts ?? []).filter((a) => a.id !== accountId) } : prev,
    );
  };

  const handleAttachTags = async (tagIds: number[]) => {
    await attachTags(influencer!.id, tagIds);
    await fetchDetail();
  };

  const handleDetachTag = async (tagId: number) => {
    await detachTag(influencer!.id, tagId);
    setInfluencer((prev) =>
      prev ? { ...prev, tags: (prev.tags ?? []).filter((tag) => tag.id !== tagId) } : prev,
    );
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
        showUpload={!!authUser}
        onInfluencerChanged={handleInfluencerChanged}
        onCreateAccount={handleCreateAccount}
        onUpdateAccount={handleUpdateAccount}
        onDeleteAccount={handleDeleteAccount}
        onAttachTags={handleAttachTags}
        onDetachTag={handleDetachTag}
      />

      <Divider my='xl' />

      <PostList influencerId={influencer!.id} />
    </Container>
  );
}
