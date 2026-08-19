import { Input, Text, SegmentedControl } from '@mantine/core';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const GENDER_EMOJIS: Record<string, string> = {
  male: '♂️',
  female: '♀️',
  other: '⚧️',
};

interface GenderSelectProps {
  label?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  error?: ReactNode;
}

export default function GenderSelect({ label, value, onChange, error }: GenderSelectProps) {
  const { t } = useTranslation();

  const data = (['female', 'male', 'other'] as const).map((key) => ({
    value: key,
    label: `${GENDER_EMOJIS[key]} ${t(`influencer.gender${key[0].toUpperCase()}${key.slice(1)}`)}`,
  }));

  return (
    <div>
      {label && (
        <Text size='sm' fw={500} mb={3}>
          {label}
        </Text>
      )}
      <SegmentedControl data={data} value={value ?? 'female'} onChange={onChange} />
      {error && <Input.Error mt={6}>{error}</Input.Error>}
    </div>
  );
}
