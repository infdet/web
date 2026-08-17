import {
  ActionIcon,
  Alert,
  Button,
  Container,
  Group,
  Loader,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'wouter';

import PostPreview from '#components/PostPreview';
import { getPost, updatePost } from '#services/post';
import type Post from '#types/Post';

interface PostEditForm {
  title: string;
  width: number | string;
  height: number | string;
  rotate: number | string;
  likeCount: number | string;
  viewCount: number | string;
  publishedAt: string;
}

function toDateTimeLocal(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export default function PostEditPage() {
  const { t } = useTranslation();
  const params = useParams();
  const [, navigate] = useLocation();
  const id = Number(params.id);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<PostEditForm>({
    initialValues: {
      title: '',
      width: '',
      height: '',
      rotate: '',
      likeCount: '',
      viewCount: '',
      publishedAt: '',
    },
  });

  const loadPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getPost(id);
      setPost(data);
      form.setValues({
        title: data.title ?? '',
        width: data.width ?? '',
        height: data.height ?? '',
        rotate: data.rotate ?? '',
        likeCount: data.likeCount ?? '',
        viewCount: data.viewCount ?? '',
        publishedAt: toDateTimeLocal(data.publishedAt),
      });
    } catch {
      setError(t('post.notFound'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleSubmit = async (values: PostEditForm) => {
    setSaving(true);
    setError('');
    try {
      await updatePost(id, {
        title: values.title.trim() || null,
        likeCount: values.likeCount === '' ? null : Number(values.likeCount),
        viewCount: values.viewCount === '' ? null : Number(values.viewCount),
        publishedAt: values.publishedAt ? new Date(values.publishedAt).toISOString() : null,
        ...(post?.type === 'video'
          ? {
              width: values.width === '' ? null : Number(values.width),
              height: values.height === '' ? null : Number(values.height),
              rotate: values.rotate === '' ? null : Number(values.rotate),
            }
          : {}),
      });
      navigate(`/posts/${id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || t('post.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container size='sm' py='xl'>
        <Group justify='center'>
          <Loader />
        </Group>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container size='sm' py='xl'>
        <Text c='dimmed'>{t('post.notFound')}</Text>
      </Container>
    );
  }

  return (
    <Container size='sm' py='xl'>
      <Group mb='lg'>
        <ActionIcon component={Link} href={`/posts/${id}`} variant='subtle'>
          <ArrowLeftIcon size={20} />
        </ActionIcon>
        <Title order={2}>{t('post.edit')}</Title>
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap='md'>
          <PostPreview
            platform={post.platform}
            type={post.type}
            externalId={post.externalId}
            externalUrl={post.externalUrl}
            embedUrl={post.embedUrl}
          />

          <TextInput
            label={t('post.postTitle')}
            placeholder={t('post.postTitle')}
            {...form.getInputProps('title')}
          />

          {post.type === 'video' && (
            <Group grow>
              <NumberInput
                label={t('post.width')}
                placeholder='1920'
                min={0}
                allowDecimal={false}
                {...form.getInputProps('width')}
              />
              <NumberInput
                label={t('post.height')}
                placeholder='1080'
                min={0}
                allowDecimal={false}
                {...form.getInputProps('height')}
              />
              <NumberInput
                label={t('post.rotate')}
                placeholder='0'
                allowDecimal={false}
                {...form.getInputProps('rotate')}
              />
            </Group>
          )}

          <Group grow>
            <NumberInput
              label={t('post.likeCount')}
              min={0}
              allowDecimal={false}
              {...form.getInputProps('likeCount')}
            />
            <NumberInput
              label={t('post.viewCount')}
              min={0}
              allowDecimal={false}
              {...form.getInputProps('viewCount')}
            />
          </Group>

          <TextInput
            type='datetime-local'
            label={t('post.publishedAt')}
            {...form.getInputProps('publishedAt')}
          />

          {error && <Alert color='red'>{error}</Alert>}

          <Group justify='flex-end'>
            <Button variant='default' onClick={() => navigate(`/posts/${id}`)}>
              {t('common.cancel')}
            </Button>
            <Button type='submit' loading={saving}>
              {t('common.save')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
