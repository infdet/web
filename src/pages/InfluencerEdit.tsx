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
import { PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'wouter';

import GenderSelect from '#components/GenderSelect';
import RegionSelect from '#components/RegionSelect';
import { createAccount, deleteAccount, updateAccount } from '#services/account';
import { createInfluencer, getInfluencer, updateInfluencer } from '#services/influencer';
import { PLATFORM_OPTIONS } from '#utils/platforms';

interface AccountForm {
  id?: number;
  platform: string;
  username: string;
}

interface InfluencerForm {
  slug: string;
  name: Record<string, string>;
  gender: string | null;
  birthDate: string;
  region: string | null;
  height: string;
  weight: string;
  bust: string;
  waist: string;
  hip: string;
  accounts: AccountForm[];
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
  const [existingAccountIds, setExistingAccountIds] = useState<number[]>([]);

  const form = useForm<InfluencerForm>({
    initialValues: {
      slug: '',
      name: { en: '', zh: '', ja: '', ko: '' },
      gender: null,
      birthDate: '',
      region: null,
      height: '',
      weight: '',
      bust: '',
      waist: '',
      hip: '',
      accounts: [{ platform: '', username: '' }],
    },
    validate: {
      slug: (v) => (!v.trim() ? t('influencer.slugRequired') : null),
      name: {
        en: (v) => (!v.trim() ? t('influencer.nameEnRequired') : null),
      },
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
      const accounts = influencer.accounts ?? [];
      setExistingAccountIds(accounts.map((a) => a.id));
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
        accounts:
          accounts.length > 0
            ? accounts.map((a) => ({ id: a.id, platform: a.platform, username: a.username }))
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
    for (const [locale, value] of Object.entries(values.name)) {
      const trimmed = value.trim();
      if (trimmed) name[locale] = trimmed;
    }

    const accounts = values.accounts.filter((a) => a.platform && a.username);

    const payload = {
      slug: values.slug.trim(),
      name,
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
        await Promise.all(
          accounts.map((a) =>
            createAccount(influencer.id, { platform: a.platform, username: a.username }),
          ),
        );
        navigate(`/influencers/${influencer.id}`);
      } else {
        const influencerId = Number(params.id);
        await updateInfluencer(influencerId, payload);

        const submittedIds = new Set(accounts.filter((a) => a.id).map((a) => a.id as number));
        const removedIds = existingAccountIds.filter((id) => !submittedIds.has(id));

        await Promise.all([
          ...removedIds.map((id) => deleteAccount(influencerId, id)),
          ...accounts.map((a) =>
            a.id
              ? updateAccount(influencerId, a.id, { platform: a.platform, username: a.username })
              : createAccount(influencerId, { platform: a.platform, username: a.username }),
          ),
        ]);

        navigate(`/influencers/${influencerId}`);
      }
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

          {NAME_LANGUAGES.map((lang) => (
            <TextInput
              key={lang.key}
              label={t(lang.label)}
              required={lang.required}
              {...form.getInputProps(`name.${lang.key}`)}
            />
          ))}

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

          <TextInput
            type='number'
            label={t('influencer.height')}
            {...form.getInputProps('height')}
          />

          <TextInput
            type='number'
            label={t('influencer.weight')}
            {...form.getInputProps('weight')}
          />

          <Group grow>
            <TextInput type='number' label={t('influencer.bust')} {...form.getInputProps('bust')} />
            <TextInput
              type='number'
              label={t('influencer.waist')}
              {...form.getInputProps('waist')}
            />
            <TextInput type='number' label={t('influencer.hip')} {...form.getInputProps('hip')} />
          </Group>

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
                    <TrashIcon size={16} />
                  </ActionIcon>
                </Group>
              ))}
              <Button variant='light' leftSection={<PlusIcon size={16} />} onClick={addAccount}>
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
