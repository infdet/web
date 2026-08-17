import {
  ActionIcon,
  Alert,
  Button,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useSearchParams } from 'wouter';

import PostPreview from '#components/PostPreview';
import { createPost } from '#services/post';
import parsePostUrl from '#utils/parsePostUrl';

interface PostNewForm {
  url: string;
}

export default function PostNewPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [, navigate] = useLocation();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<PostNewForm>({
    initialValues: { url: searchParams.get('url') ?? '' },
  });

  const parsed = useMemo(() => parsePostUrl(form.values.url), [form.values.url]);

  const handleSubmit = async () => {
    if (!parsed) return;
    setSaving(true);
    setError('');
    try {
      const post = await createPost({
        platform: parsed.platform,
        type: parsed.type,
        externalUrl: parsed.externalUrl,
        externalId: parsed.externalId,
        title: null,
      });
      navigate(`/posts/${post.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || t('post.createFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container size='sm' py='xl'>
      <Group mb='lg'>
        <ActionIcon component={Link} href='/influencers' variant='subtle'>
          <ArrowLeftIcon size={20} />
        </ActionIcon>
        <Title order={2}>{t('post.new')}</Title>
      </Group>

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

          {error && <Alert color='red'>{error}</Alert>}

          <Group justify='flex-end'>
            <Button variant='default' onClick={() => navigate('/influencers')}>
              {t('common.cancel')}
            </Button>
            <Button type='submit' loading={saving} disabled={!parsed}>
              {t('post.create')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
