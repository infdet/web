import {
  ActionIcon,
  Alert,
  Anchor,
  AspectRatio,
  Badge,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { ArrowLeftIcon, LinkIcon } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useSearchParams } from 'wouter';

import { createPost } from '#services/post';
import parsePostUrl from '#utils/parsePostUrl';

export default function PostNewPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [, navigate] = useLocation();

  const [url, setUrl] = useState(searchParams.get('url') ?? '');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const parsed = useMemo(() => parsePostUrl(url), [url]);

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
        title: title.trim() || null,
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

      <Stack gap='md'>
        <TextInput
          label={t('post.url')}
          placeholder={t('post.urlPlaceholder')}
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
        />

        {!url.trim() ? (
          <Text c='dimmed' size='sm'>
            {t('post.enterUrl')}
          </Text>
        ) : !parsed ? (
          <Alert color='red'>{t('post.unsupportedUrl')}</Alert>
        ) : (
          <Stack gap='sm'>
            <TextInput
              label={t('post.postTitle')}
              placeholder={t('post.postTitle')}
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
            <Text fw={600}>{t('post.preview')}</Text>
            <Paper withBorder radius='md' p='md'>
              <Stack gap='sm'>
                <Group gap='xs'>
                  <Badge variant='light'>{t(`platform.${parsed.platform}`)}</Badge>
                  <Badge variant='outline'>{t(`postType.${parsed.type}`)}</Badge>
                </Group>

                {parsed.embedUrl ? (
                  <AspectRatio ratio={16 / 9}>
                    <iframe
                      src={parsed.embedUrl}
                      title={`${parsed.platform} ${parsed.externalId}`}
                      allowFullScreen
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      style={{ border: 0 }}
                    />
                  </AspectRatio>
                ) : (
                  <AspectRatio ratio={16 / 9}>
                    <Stack gap={4} align='center' justify='center'>
                      <Text size='sm' fw={600} c='dimmed'>
                        {t(`platform.${parsed.platform}`)}
                      </Text>
                      <Text size='xs' c='dimmed'>
                        {t(`postType.${parsed.type}`)}
                      </Text>
                    </Stack>
                  </AspectRatio>
                )}

                <Group justify='space-between' wrap='nowrap' gap='xs'>
                  <Text size='xs' c='dimmed' truncate style={{ flex: 1 }}>
                    {parsed.externalId}
                  </Text>
                  <Anchor href={parsed.externalUrl} target='_blank' size='sm' rel='noreferrer'>
                    <LinkIcon size={14} style={{ marginRight: 4 }} />
                    {t('influencer.link')}
                  </Anchor>
                </Group>
              </Stack>
            </Paper>
          </Stack>
        )}

        {error && <Alert color='red'>{error}</Alert>}

        <Group justify='flex-end'>
          <Button variant='default' onClick={() => navigate('/influencers')}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} loading={saving} disabled={!parsed}>
            {t('post.create')}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
