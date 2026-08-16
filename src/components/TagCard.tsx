import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  FileButton,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { CameraIcon, PencilIcon, TagIcon, TrashIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import type Tag from '#types/Tag';
import { getLocalizedName } from '#utils/localized';

interface TagCardProps {
  tag: Tag;
  canEdit: boolean;
  canDelete: boolean;
  uploading: boolean;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
  onUploadIcon: (tag: Tag, file: File | null) => void;
}

export default function TagCard({
  tag,
  canEdit,
  canDelete,
  uploading,
  onEdit,
  onDelete,
  onUploadIcon,
}: TagCardProps) {
  const { t } = useTranslation();

  return (
    <Card shadow='sm' padding='xs' radius='md' withBorder>
      <Group justify='space-between' wrap='nowrap' gap='xs'>
        <Group gap='sm' wrap='nowrap' style={{ flex: 1, minWidth: 0 }}>
          <Box pos='relative'>
            <Avatar src={tag.icon ?? undefined} radius='100%' size='xl'>
              <TagIcon size={32} />
            </Avatar>
            {canEdit && (
              <FileButton onChange={(file) => onUploadIcon(tag, file)} accept='image/*'>
                {(props) => (
                  <Tooltip label={t('tag.uploadIcon')} withArrow>
                    <ActionIcon
                      {...props}
                      variant='filled'
                      radius='xl'
                      size='sm'
                      aria-label={t('tag.uploadIcon')}
                      loading={uploading}
                      pos='absolute'
                      bottom={0}
                      right={0}
                    >
                      <CameraIcon size={16} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </FileButton>
            )}
          </Box>
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <Text fw={600} lineClamp={1}>
              {getLocalizedName(tag.name, t('tag.unknown'))}
            </Text>
            <Text size='xs' c='dimmed' lineClamp={1}>
              @{tag.slug}
            </Text>
          </Stack>
        </Group>
        {(canEdit || canDelete) && (
          <Group gap={4} wrap='nowrap'>
            {canEdit && (
              <ActionIcon variant='subtle' color='blue' size='sm' onClick={() => onEdit(tag)}>
                <PencilIcon size={14} />
              </ActionIcon>
            )}
            {canDelete && (
              <ActionIcon variant='subtle' color='red' size='sm' onClick={() => onDelete(tag)}>
                <TrashIcon size={14} />
              </ActionIcon>
            )}
          </Group>
        )}
      </Group>
    </Card>
  );
}
