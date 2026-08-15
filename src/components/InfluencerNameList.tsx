import { Badge, Group, Text } from '@mantine/core';
import type { BadgeVariant } from '@mantine/core';

interface InfluencerNameListProps {
  name: Record<string, string>;
  /** Name value to exclude, e.g. the primary localized name already shown elsewhere. */
  exclude?: string;
  badgeVariant?: BadgeVariant;
}

export default function InfluencerNameList({
  name,
  exclude,
  badgeVariant = 'outline',
}: InfluencerNameListProps) {
  return (
    <Group gap='xs'>
      {Object.entries(name)
        .filter(([, value]) => value !== exclude)
        .map(([locale, value]) => (
          <Group key={locale} gap='xs' wrap='nowrap'>
            <Badge variant={badgeVariant} size='xs' tt='uppercase'>
              {locale}
            </Badge>
            <Text size='sm' c='dimmed' lineClamp={1}>
              {value}
            </Text>
          </Group>
        ))}
    </Group>
  );
}
