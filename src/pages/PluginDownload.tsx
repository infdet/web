import {
  Anchor,
  Badge,
  Button,
  Card,
  Container,
  Group,
  List,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  Circle,
  DownloadSimpleIcon,
  FireIcon,
  PuzzlePieceIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

const FIREFOX_ADDON_URL = 'https://addons.mozilla.org/zh-CN/firefox/addon/influencer-detector/';

export default function PluginDownloadPage() {
  const { t } = useTranslation();

  return (
    <Container size='md' py='xl'>
      <Stack gap='lg'>
        <Group justify='center'>
          <Badge variant='light' color='orange' size='lg'>
            <Group gap='xs'>
              <FireIcon size={16} weight='fill' />
              {t('plugin.badge')}
            </Group>
          </Badge>
        </Group>

        <Title order={1} ta='center'>
          {t('plugin.title')}
        </Title>
        <Text c='dimmed' ta='center' size='lg'>
          {t('plugin.description')}
        </Text>

        <Group justify='center' mt='md'>
          <Button
            component='a'
            href={FIREFOX_ADDON_URL}
            target='_blank'
            rel='noopener noreferrer'
            size='lg'
            leftSection={<DownloadSimpleIcon size={20} />}
          >
            {t('plugin.installFirefox')}
          </Button>
        </Group>

        <Card withBorder radius='md' p='lg' mt='lg'>
          <Stack gap='md'>
            <Title order={3}>{t('plugin.featuresTitle')}</Title>
            <List
              spacing='sm'
              icon={
                <ThemeIcon variant='light' radius='xl'>
                  <Circle size={10} weight='fill' />
                </ThemeIcon>
              }
            >
              <List.Item>
                <Group gap='xs' align='center'>
                  <PuzzlePieceIcon size={20} />
                  <Text>{t('plugin.feature1')}</Text>
                </Group>
              </List.Item>
              <List.Item>
                <Group gap='xs' align='center'>
                  <ShieldCheckIcon size={20} />
                  <Text>{t('plugin.feature2')}</Text>
                </Group>
              </List.Item>
              <List.Item>
                <Group gap='xs' align='center'>
                  <FireIcon size={20} />
                  <Text>{t('plugin.feature3')}</Text>
                </Group>
              </List.Item>
            </List>
          </Stack>
        </Card>

        <Text ta='center' c='dimmed' size='sm'>
          {t('plugin.compatible')}{' '}
          <Anchor href='https://www.mozilla.org/firefox/' target='_blank' rel='noopener noreferrer'>
            Mozilla Firefox
          </Anchor>
        </Text>
      </Stack>
    </Container>
  );
}
