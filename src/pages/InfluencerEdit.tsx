import {
  ActionIcon,
  Button,
  Container,
  Fieldset,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Plus, Trash } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'wouter';

import { createInfluencer, getInfluencer, updateInfluencer } from '#services/influencer';

interface AccountForm {
  platform: string;
  username: string;
}

interface InfluencerForm {
  slug: string;
  nameEn: string;
  nameZh: string;
  accounts: AccountForm[];
}

const PLATFORM_OPTIONS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'bilibili', label: 'Bilibili' },
  { value: 'weibo', label: 'Weibo' },
  { value: 'douyin', label: 'Douyin' },
  { value: 'xiaohongshu', label: 'Xiaohongshu' },
  { value: 'other', label: 'Other' },
];

export default function InfluencerEditPage() {
  const { t } = useTranslation();
  const params = useParams();
  const [, navigate] = useLocation();
  const isNew = !params.id || params.id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<InfluencerForm>({
    initialValues: {
      slug: '',
      nameEn: '',
      nameZh: '',
      accounts: [{ platform: '', username: '' }],
    },
    validate: {
      slug: (v) => (!v.trim() ? t('influencer.slugRequired') : null),
      nameEn: (v) => (!v.trim() ? t('influencer.nameEnRequired') : null),
      accounts: {
        platform: (v) => (!v ? t('influencer.platformRequired') : null),
        username: (v) => (!v ? t('influencer.usernameRequired') : null),
      },
    },
  });

  const loadInfluencer = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const influencer = await getInfluencer(Number(params.id));
      form.setValues({
        slug: influencer.slug,
        nameEn: influencer.name?.en ?? '',
        nameZh: influencer.name?.zh ?? '',
        accounts:
          influencer.accounts?.length > 0
            ? influencer.accounts.map((a) => ({ platform: a.platform, username: a.username }))
            : [{ platform: '', username: '' }],
      });
    } catch {
      setError(t('influencer.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadInfluencer();
  }, [loadInfluencer]);

  const handleSubmit = async (values: InfluencerForm) => {
    setSaving(true);
    setError('');

    const name: Record<string, string> = {};
    if (values.nameEn.trim()) name.en = values.nameEn.trim();
    if (values.nameZh.trim()) name.zh = values.nameZh.trim();

    const accounts = values.accounts.filter((a) => a.platform && a.username);

    const payload = {
      slug: values.slug.trim(),
      name,
      accounts,
    };

    try {
      if (isNew) {
        await createInfluencer(payload);
      } else {
        await updateInfluencer(Number(params.id), payload);
      }
      navigate('/influencers');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || t('influencer.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const addAccount = () => {
    form.insertListItem('accounts', { platform: '', username: '' });
  };

  const removeAccount = (index: number) => {
    form.removeListItem('accounts', index);
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

  return (
    <Container size='sm' py='xl'>
      <Title order={2} mb='lg'>
        {isNew ? t('influencer.new') : t('influencer.edit')}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap='md'>
          <TextInput
            label={t('influencer.slug')}
            placeholder={t('influencer.slugPlaceholder')}
            {...form.getInputProps('slug')}
          />

          <TextInput
            label={t('influencer.nameEn')}
            placeholder={t('influencer.nameEnPlaceholder')}
            {...form.getInputProps('nameEn')}
          />

          <TextInput
            label={t('influencer.nameZh')}
            placeholder={t('influencer.nameZhPlaceholder')}
            {...form.getInputProps('nameZh')}
          />

          <Fieldset legend={t('influencer.socialAccounts')}>
            <Stack gap='sm'>
              {form.values.accounts.map((_, index) => (
                <Group key={form.key(`accounts.${index}`)} gap='sm' align='flex-start'>
                  <Select
                    data={PLATFORM_OPTIONS}
                    placeholder={t('influencer.platformPlaceholder')}
                    searchable
                    style={{ flex: 1 }}
                    {...form.getInputProps(`accounts.${index}.platform`)}
                  />
                  <TextInput
                    placeholder={t('influencer.usernamePlaceholder')}
                    style={{ flex: 1 }}
                    {...form.getInputProps(`accounts.${index}.username`)}
                  />
                  <ActionIcon
                    color='red'
                    variant='subtle'
                    onClick={() => removeAccount(index)}
                    disabled={form.values.accounts.length <= 1}
                    mt={2}
                  >
                    <Trash size={16} />
                  </ActionIcon>
                </Group>
              ))}
              <Button variant='light' leftSection={<Plus size={16} />} onClick={addAccount}>
                {t('influencer.addAccount')}
              </Button>
            </Stack>
          </Fieldset>

          {error && (
            <Text c='red' size='sm'>
              {error}
            </Text>
          )}

          <Group justify='flex-end'>
            <Button variant='default' onClick={() => navigate('/influencers')}>
              {t('influencer.cancel')}
            </Button>
            <Button type='submit' loading={saving}>
              {isNew ? t('influencer.create') : t('influencer.save')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
