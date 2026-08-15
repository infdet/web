import { ActionIcon, Avatar, Box, FileButton, Tooltip } from '@mantine/core';
import { CameraIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

interface InfluencerAvatarProps {
  src: string | null;
  size?: number;
  showUpload: boolean;
  uploading: boolean;
  onUpload: (file: File | null) => void;
}

export default function InfluencerAvatar({
  src,
  size = 80,
  showUpload,
  uploading,
  onUpload,
}: InfluencerAvatarProps) {
  const { t } = useTranslation();

  return (
    <Box pos='relative'>
      <Avatar src={src ?? undefined} size={size} radius='50%' color='gray'>
        {!src && <CameraIcon size={Math.round(size * 0.35)} />}
      </Avatar>
      {showUpload && (
        <FileButton onChange={onUpload} accept='image/*'>
          {(props) => (
            <Tooltip label={t('influencer.uploadAvatar')} withArrow>
              <ActionIcon
                {...props}
                variant='filled'
                color='dark'
                radius='xl'
                size='sm'
                aria-label={t('influencer.uploadAvatar')}
                loading={uploading}
                pos='absolute'
                bottom={0}
                right={0}
              >
                <CameraIcon size={14} />
              </ActionIcon>
            </Tooltip>
          )}
        </FileButton>
      )}
    </Box>
  );
}
