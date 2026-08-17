import { Select, type SelectProps } from '@mantine/core';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { COUNTRY_CODES, regionToFlag } from '#utils/countries';

interface RegionSelectProps {
  label?: string;
  placeholder?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  error?: ReactNode;
}

export default function RegionSelect({
  label,
  placeholder,
  value,
  onChange,
  error,
}: RegionSelectProps) {
  const { i18n } = useTranslation();

  const data = useMemo(() => {
    const locale = i18n.language.split('-')[0];
    const displayNames = new Intl.DisplayNames([locale, 'en'], { type: 'region' });

    return COUNTRY_CODES.map((code) => {
      const upper = code.toUpperCase();
      let name = upper;
      try {
        name = displayNames.of(upper) ?? upper;
      } catch {
        // fall back to the raw code
      }
      return { value: code, label: `${regionToFlag(code)} ${name}` };
    });
  }, [i18n.language]);

  const filter: SelectProps['filter'] = ({ options, search }) => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => {
      if ('group' in option) return false;
      return (
        option.value.toLowerCase().includes(query) || option.label.toLowerCase().includes(query)
      );
    });
  };

  return (
    <Select
      label={label}
      placeholder={placeholder}
      data={data}
      searchable
      clearable
      filter={filter}
      value={value ?? null}
      onChange={onChange}
      error={error}
    />
  );
}
