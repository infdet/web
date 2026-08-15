import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type Tag from '#types/Tag';

interface TagFormModalProps {
  opened: boolean;
  title: string;
  initialValues?: Tag;
  onClose: () => void;
  onSubmit: (data: { slug: string; name: Record<string, string> }) => Promise<void>;
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
  const [slug, setSlug] = useState('');
  const [name, setName] = useState<Record<string, string>>({ en: '', zh: '', ja: '', ko: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const initialValuesRef = useRef(initialValues);
  useEffect(() => {
    initialValuesRef.current = initialValues;
  });

  useEffect(() => {
    if (!opened) return;
    const init = initialValuesRef.current;
    setSlug(init?.slug ?? '');
    setName({
      en: init?.name?.en ?? '',
      zh: init?.name?.zh ?? '',
      ja: init?.name?.ja ?? '',
      ko: init?.name?.ko ?? '',
    });
    setError('');
    setSaving(false);
  }, [opened]);

  const handleSubmit = async () => {
    setSaving(true);
    setError('');

    const trimmedName: Record<string, string> = {};
    for (const [locale, value] of Object.entries(name)) {
      const trimmed = value.trim();
      if (trimmed) trimmedName[locale] = trimmed;
    }

    try {
      await onSubmit({ slug: slug.trim(), name: trimmedName });
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
      <Stack gap='sm'>
        <TextInput
          label={t('tag.slug')}
          placeholder={t('tag.slugPlaceholder')}
          value={slug}
          onChange={(e) => setSlug(e.currentTarget.value)}
          data-autofocus
        />
        {NAME_LANGUAGES.map((lang) => (
          <TextInput
            key={lang.key}
            label={t(lang.label)}
            required={lang.required}
            value={name[lang.key] ?? ''}
            onChange={(e) => setName((prev) => ({ ...prev, [lang.key]: e.currentTarget.value }))}
          />
        ))}
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
            loading={saving}
            disabled={!slug.trim() || !name.en?.trim()}
            onClick={handleSubmit}
          >
            {t('tag.save')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
