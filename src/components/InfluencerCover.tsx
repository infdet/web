import { ActionIcon, Box, FileButton, Image, Tooltip } from '@mantine/core';
import { CameraIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { uploadCover } from '#services/influencer';
import type Influencer from '#types/Influencer';

interface InfluencerCoverProps {
  src: string | null;
  showUpload: boolean;
  influencerId: number;
  onCoverChanged: (updated: Influencer) => void;
}

export default function InfluencerCover({
  src,
  showUpload,
  influencerId,
  onCoverChanged,
}: InfluencerCoverProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const updated = await uploadCover(influencerId, file);
      onCoverChanged(updated);
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box pos='relative' w={300} mx={{ base: 'auto', sm: 0 }} style={{ flexShrink: 0 }}>
      <Image
        src={src ?? undefined}
        fallbackSrc='/cover-fallback.svg'
        alt={t('influencer.cover')}
        w='100%'
        radius='md'
        fit='cover'
        style={{ aspectRatio: '9 / 16' }}
      />

      {showUpload && (
        <FileButton onChange={handleUpload} accept='image/*'>
          {(props) => (
            <Tooltip label={t('influencer.uploadCover')} withArrow>
              <ActionIcon
                {...props}
                variant='filled'
                color='dark'
                radius='xl'
                aria-label={t('influencer.uploadCover')}
                loading={uploading}
                pos='absolute'
                top={12}
                right={12}
              >
                <CameraIcon size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </FileButton>
      )}
    </Box>
  );
}
