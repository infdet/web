import {
  Button,
  Container,
  Group,
  Loader,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'wouter';

import GenderSelect from '#components/GenderSelect';
import RegionSelect from '#components/RegionSelect';
import useSlugSync from '#hooks/useSlugSync';
import { createInfluencer, getInfluencer, updateInfluencer } from '#services/influencer';

interface InfluencerForm {
  slug: string;
  name: Record<string, string>;
  alias: string;
  gender: string | null;
  birthDate: string;
  region: string | null;
  height: string;
  weight: string;
  bust: string;
  waist: string;
  hip: string;
}

const NAME_LANGUAGES = [
  {
    key: 'en',
    label: 'influencer.nameEn',
    required: true,
  },
  { key: 'zh', label: 'influencer.nameZh' },
  { key: 'ja', label: 'influencer.nameJa' },
  { key: 'ko', label: 'influencer.nameKo' },
];

export default function InfluencerEditPage() {
  const { t } = useTranslation();
  const params = useParams();
  const [, navigate] = useLocation();
  const isNew = !params.id || params.id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { initSlugTouched, handleNameEnChange, handleSlugChange } = useSlugSync();

  const form = useForm<InfluencerForm>({
    initialValues: {
      slug: '',
      name: { en: '', zh: '', ja: '', ko: '' },
      alias: '',
      gender: 'female',
      birthDate: '',
      region: null,
      height: '',
      weight: '',
      bust: '',
      waist: '',
      hip: '',
    },
    validate: {
      slug: (v) => (!v.trim() ? t('influencer.slugRequired') : null),
      name: {
        en: (v) => (!v.trim() ? t('influencer.nameEnRequired') : null),
      },
    },
  });

  const loadInfluencer = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const influencer = await getInfluencer(Number(params.id));
      const nameEn = influencer.name?.en ?? '';
      const slug = influencer.slug ?? '';
      initSlugTouched(nameEn, slug);
      form.setValues({
        slug: influencer.slug,
        name: {
          en: influencer.name?.en ?? '',
          zh: influencer.name?.zh ?? '',
          ja: influencer.name?.ja ?? '',
          ko: influencer.name?.ko ?? '',
        },
        gender: influencer.gender ?? null,
        birthDate: influencer.birthDate ?? '',
        region: influencer.region ?? null,
        height: influencer.height?.toString() ?? '',
        weight: influencer.weight?.toString() ?? '',
        bust: influencer.bust?.toString() ?? '',
        waist: influencer.waist?.toString() ?? '',
        hip: influencer.hip?.toString() ?? '',
        alias: (influencer.alias ?? []).join(', '),
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
    for (const [locale, value] of Object.entries(values.name)) {
      const trimmed = value.trim();
      if (trimmed) name[locale] = trimmed;
    }

    const payload = {
      slug: values.slug.trim(),
      name,
      alias: values.alias
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0),
      gender: values.gender || null,
      birthDate: values.birthDate || null,
      region: values.region?.trim().toLowerCase() || null,
      height: values.height ? Number(values.height) : null,
      weight: values.weight ? Number(values.weight) : null,
      bust: values.bust ? Number(values.bust) : null,
      waist: values.waist ? Number(values.waist) : null,
      hip: values.hip ? Number(values.hip) : null,
    };

    try {
      if (isNew) {
        const influencer = await createInfluencer(payload);
        navigate(`/influencers/${influencer.slug}`);
      } else {
        const influencerId = Number(params.id);
        await updateInfluencer(influencerId, payload);
        navigate(`/influencers/${payload.slug}`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || t('influencer.saveFailed'));
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

  return (
    <Container size='sm' py='xl'>
      <Title order={2} mb='lg'>
        {isNew ? t('influencer.new') : t('influencer.edit')}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap='md'>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {NAME_LANGUAGES.map((lang) => (
              <TextInput
                key={lang.key}
                label={t(lang.label)}
                required={lang.required}
                {...form.getInputProps(`name.${lang.key}`)}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  if (lang.key === 'en') {
                    handleNameEnChange(value, form.setFieldValue);
                  } else {
                    form.setFieldValue(`name.${lang.key}`, value);
                  }
                }}
              />
            ))}
          </SimpleGrid>

          <TextInput
            label={t('influencer.slug')}
            placeholder={t('influencer.slugPlaceholder')}
            {...form.getInputProps('slug')}
            onChange={(e) => {
              handleSlugChange(e.currentTarget.value, form.setFieldValue);
            }}
          />

          <TextInput
            label={t('influencer.alias')}
            placeholder={t('influencer.aliasPlaceholder')}
            {...form.getInputProps('alias')}
          />

          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <GenderSelect label={t('influencer.gender')} {...form.getInputProps('gender')} />

            <TextInput
              type='date'
              label={t('influencer.birthDate')}
              {...form.getInputProps('birthDate')}
            />

            <RegionSelect
              label={t('influencer.region')}
              placeholder={t('influencer.regionPlaceholder')}
              {...form.getInputProps('region')}
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 2, sm: 5 }}>
            <NumberInput
              label={t('influencer.height')}
              suffix=' cm'
              {...form.getInputProps('height')}
            />

            <NumberInput
              label={t('influencer.weight')}
              suffix=' kg'
              {...form.getInputProps('weight')}
            />

            <NumberInput
              label={t('influencer.bust')}
              suffix=' cm'
              {...form.getInputProps('bust')}
            />

            <NumberInput
              label={t('influencer.waist')}
              suffix=' cm'
              {...form.getInputProps('waist')}
            />

            <NumberInput label={t('influencer.hip')} suffix=' cm' {...form.getInputProps('hip')} />
          </SimpleGrid>

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
