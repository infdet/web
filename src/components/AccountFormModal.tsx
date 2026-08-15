import { Button, Group, Modal, Select, Stack, Text, TextInput } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PLATFORM_OPTIONS } from '#utils/platforms';

interface AccountFormModalProps {
  opened: boolean;
  title: string;
  initialValues?: { platform: string; username: string };
  onClose: () => void;
  onSubmit: (data: { platform: string; username: string }) => Promise<void>;
}

export default function AccountFormModal({
  opened,
  title,
  initialValues,
  onClose,
  onSubmit,
}: AccountFormModalProps) {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState(initialValues?.platform ?? '');
  const [username, setUsername] = useState(initialValues?.username ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const initialValuesRef = useRef(initialValues);
  useEffect(() => {
    initialValuesRef.current = initialValues;
  });

  useEffect(() => {
    if (!opened) return;
    setPlatform(initialValuesRef.current?.platform ?? '');
    setUsername(initialValuesRef.current?.username ?? '');
    setError('');
    setSaving(false);
  }, [opened]);

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await onSubmit({ platform, username });
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          t('influencer.saveFailed'),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Stack gap='sm'>
        <Select
          label={t('influencer.platform')}
          data={PLATFORM_OPTIONS}
          placeholder={t('influencer.platformPlaceholder')}
          value={platform}
          onChange={(v) => setPlatform(v ?? '')}
          searchable
          data-autofocus
        />
        <TextInput
          label={t('influencer.username')}
          placeholder={t('influencer.usernamePlaceholder')}
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
        {error && (
          <Text c='red' size='sm'>
            {error}
          </Text>
        )}
        <Group justify='flex-end'>
          <Button variant='default' onClick={onClose}>
            {t('influencer.cancel')}
          </Button>
          <Button loading={saving} disabled={!platform || !username} onClick={handleSubmit}>
            {t('influencer.save')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
