import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import AppHeader from '#components/AppHeader';
import AppNavbar from '#components/AppNavbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
    >
      <AppHeader opened={opened} onToggle={toggle} />

      <AppNavbar onNavigate={close} />

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
