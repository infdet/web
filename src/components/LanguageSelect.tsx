import { Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
];

interface LanguageSelectProps {
  size?: string;
  w?: number | string;
  mt?: string;
  mx?: string;
}

export default function LanguageSelect({ size = 'xs', w = 100, mt, mx }: LanguageSelectProps) {
  const { i18n } = useTranslation();

  return (
    <Select
      data={LANGUAGE_OPTIONS}
      value={i18n.language.split('-')[0]}
      onChange={(v) => v && i18n.changeLanguage(v)}
      size={size}
      w={w}
      mt={mt}
      mx={mx}
    />
  );
}
