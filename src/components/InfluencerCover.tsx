import { ActionIcon, Box, FileButton, Image, Tooltip } from '@mantine/core';
import { CameraIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

interface InfluencerCoverProps {
  src: string | null;
  showUpload: boolean;
  uploading: boolean;
  onUpload: (file: File | null) => void;
}

export default function InfluencerCover({
  src,
  showUpload,
  uploading,
  onUpload,
}: InfluencerCoverProps) {
  const { t } = useTranslation();

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
        <FileButton onChange={onUpload} accept='image/*'>
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
