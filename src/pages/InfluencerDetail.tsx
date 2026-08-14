import { ActionIcon, Badge, Container, Divider, Group, Loader, Text, Title } from '@mantine/core';
import { ArrowLeftIcon, PencilIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'wouter';

import InfluencerInfo from '#components/InfluencerInfo';
import PostList from '#components/PostList';
import useAuthUser from '#hooks/useAuthUser';
import { createAccount, deleteAccount, updateAccount } from '#services/account';
import { getInfluencer, uploadAvatar, uploadCover } from '#services/influencer';
import type Influencer from '#types/Influencer';
import { getInfluencerName } from '#utils/influencer';

export default function InfluencerDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = Number(params.id);

  const [authUser] = useAuthUser();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(true);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const inf = await getInfluencer(id);
      setInfluencer(inf);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleUploadAvatar = async (file: File | null) => {
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const updated = await uploadAvatar(id, file);
      setInfluencer(updated);
    } catch {
      // ignore
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUploadCover = async (file: File | null) => {
    if (!file) return;
    setUploadingCover(true);
    try {
      const updated = await uploadCover(id, file);
      setInfluencer(updated);
    } catch {
      // ignore
    } finally {
      setUploadingCover(false);
    }
  };

  const handleCreateAccount = async (data: { platform: string; username: string }) => {
    const account = await createAccount(id, data);
    setInfluencer((prev) =>
      prev ? { ...prev, accounts: [...(prev.accounts ?? []), account] } : prev,
    );
  };

  const handleUpdateAccount = async (
    accountId: number,
    data: { platform: string; username: string },
  ) => {
    const account = await updateAccount(id, accountId, data);
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
    await deleteAccount(id, accountId);
    setInfluencer((prev) =>
      prev ? { ...prev, accounts: (prev.accounts ?? []).filter((a) => a.id !== accountId) } : prev,
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
      <Group mb='xl'>
        <ActionIcon component={Link} href='/influencers' variant='subtle'>
          <ArrowLeftIcon size={20} />
        </ActionIcon>
        <Title order={2}>{getInfluencerName(influencer.name, t('influencer.unknown'))}</Title>
        <Badge variant='light'>@{influencer.slug}</Badge>
        {authUser && (
          <ActionIcon
            component={Link}
            href={`/influencers/${influencer.id}/edit`}
            variant='subtle'
            color='blue'
          >
            <PencilIcon size={18} />
          </ActionIcon>
        )}
      </Group>

      <InfluencerInfo
        influencer={influencer}
        showUpload={!!authUser}
        uploadingAvatar={uploadingAvatar}
        uploadingCover={uploadingCover}
        onUploadAvatar={handleUploadAvatar}
        onUploadCover={handleUploadCover}
        onCreateAccount={handleCreateAccount}
        onUpdateAccount={handleUpdateAccount}
        onDeleteAccount={handleDeleteAccount}
      />

      <Divider my='xl' />

      <PostList influencerId={id} />
    </Container>
  );
}
