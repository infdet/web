import { Button, Group, Modal, Stack, Switch, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type Tag from '#types/Tag';

interface TagFormModalProps {
  opened: boolean;
  title: string;
  initialValues?: Tag;
  onClose: () => void;
  onSubmit: (data: {
    slug: string;
    name: Record<string, string>;
    forInfluencer: boolean;
  }) => Promise<void>;
}

interface TagForm {
  slug: string;
  name: Record<string, string>;
  forInfluencer: boolean;
}

const NAME_LANGUAGES = [
  { key: 'en', label: 'tag.nameEn', required: true },
  { key: 'zh', label: 'tag.nameZh' },
  { key: 'ja', label: 'tag.nameJa' },
  { key: 'ko', label: 'tag.nameKo' },
];

export default function TagFormModal({
  opened,
  title,
  initialValues,
  onClose,
  onSubmit,
}: TagFormModalProps) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<TagForm>({
    initialValues: {
      slug: '',
      name: { en: '', zh: '', ja: '', ko: '' },
      forInfluencer: false,
    },
    validate: {
      slug: (v) => (!v.trim() ? t('tag.slugRequired') : null),
      name: {
        en: (v) => (!v.trim() ? t('tag.nameEnRequired') : null),
      },
    },
  });
  const { setValues } = form;

  const initialValuesRef = useRef(initialValues);
  useEffect(() => {
    initialValuesRef.current = initialValues;
  });

  useEffect(() => {
    if (!opened) return;
    const init = initialValuesRef.current;
    setValues({
      slug: init?.slug ?? '',
      name: {
        en: init?.name?.en ?? '',
        zh: init?.name?.zh ?? '',
        ja: init?.name?.ja ?? '',
        ko: init?.name?.ko ?? '',
      },
      forInfluencer: init?.forInfluencer ?? false,
    });
    setError('');
    setSaving(false);
  }, [opened, setValues]);

  const handleSubmit = async (values: TagForm) => {
    setSaving(true);
    setError('');

    const trimmedName: Record<string, string> = {};
    for (const [locale, value] of Object.entries(values.name)) {
      const trimmed = value.trim();
      if (trimmed) trimmedName[locale] = trimmed;
    }

    try {
      await onSubmit({
        slug: values.slug.trim(),
        name: trimmedName,
        forInfluencer: values.forInfluencer,
      });
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          t('tag.saveFailed'),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered size='md'>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap='sm'>
          <TextInput
            label={t('tag.slug')}
            placeholder={t('tag.slugPlaceholder')}
            data-autofocus
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
          <Switch
            label={t('tag.forInfluencer')}
            {...form.getInputProps('forInfluencer', { type: 'checkbox' })}
          />
          {error && (
            <Text c='red' size='sm'>
              {error}
            </Text>
          )}
          <Group justify='flex-end'>
            <Button variant='default' onClick={onClose}>
              {t('tag.cancel')}
            </Button>
            <Button
              type='submit'
              loading={saving}
              disabled={!form.values.slug.trim() || !form.values.name.en?.trim()}
            >
              {t('tag.save')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
