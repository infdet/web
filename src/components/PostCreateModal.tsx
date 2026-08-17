import { Alert, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PostPreview from '#components/PostPreview';
import { attachPosts, createPost } from '#services/post';
import parsePostUrl from '#utils/parsePostUrl';

interface PostCreateModalProps {
  opened: boolean;
  influencerId: number;
  onClose: () => void;
  onCreated: () => Promise<void>;
}

export default function PostCreateModal({
  opened,
  influencerId,
  onClose,
  onCreated,
}: PostCreateModalProps) {
  const { t } = useTranslation();
  const [creating, setCreating] = useState(false);

  const form = useForm<{ url: string }>({
    initialValues: { url: '' },
  });
  const { setValues } = form;

  const parsed = useMemo(() => parsePostUrl(form.values.url), [form.values.url]);

  useEffect(() => {
    if (!opened) return;
    setValues({ url: '' });
  }, [opened, setValues]);

  const handleSubmit = async () => {
    if (!parsed) return;
    setCreating(true);
    try {
      const created = await createPost({
        platform: parsed.platform,
        type: parsed.type,
        externalUrl: parsed.externalUrl,
        externalId: parsed.externalId,
        title: null,
      });
      await attachPosts(influencerId, created.id);
      await onCreated();
      onClose();
      setValues({ url: '' });
    } catch {
      // ignore
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t('influencer.createNewPost')} size='md'>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap='md'>
          <TextInput
            label={t('post.url')}
            placeholder={t('post.urlPlaceholder')}
            {...form.getInputProps('url')}
          />

          {!form.values.url.trim() ? (
            <Text c='dimmed' size='sm'>
              {t('post.enterUrl')}
            </Text>
          ) : !parsed ? (
            <Alert color='red'>{t('post.unsupportedUrl')}</Alert>
          ) : (
            <Stack gap='sm'>
              <Text fw={600}>{t('post.preview')}</Text>
              <PostPreview
                platform={parsed.platform}
                type={parsed.type}
                externalId={parsed.externalId}
                externalUrl={parsed.externalUrl}
                embedUrl={parsed.embedUrl}
              />
            </Stack>
          )}

          <Group justify='flex-end'>
            <Button variant='default' onClick={onClose}>
              {t('influencer.cancel')}
            </Button>
            <Button type='submit' loading={creating} disabled={!parsed}>
              {t('influencer.createAndAttach')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
