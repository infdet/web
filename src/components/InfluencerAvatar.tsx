import { ActionIcon, Avatar, Box, FileButton, Tooltip } from '@mantine/core';
import { CameraIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { uploadAvatar } from '#services/influencer';
import type Influencer from '#types/Influencer';

interface InfluencerAvatarProps {
  src: string | null;
  size?: number;
  showUpload: boolean;
  influencerId: number;
  onAvatarChanged: (updated: Influencer) => void;
}

export default function InfluencerAvatar({
  src,
  size = 80,
  showUpload,
  influencerId,
  onAvatarChanged,
}: InfluencerAvatarProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const updated = await uploadAvatar(influencerId, file);
      onAvatarChanged(updated);
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box pos='relative'>
      <Avatar src={src ?? undefined} size={size} radius='50%' color='gray'>
        {!src && <CameraIcon size={Math.round(size * 0.35)} />}
      </Avatar>
      {showUpload && (
        <FileButton onChange={handleUpload} accept='image/*'>
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
