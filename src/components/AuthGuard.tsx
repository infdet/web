import { Button, Center } from '@mantine/core';
import { Link } from 'wouter';

import useAuthUser from '#hooks/useAuthUser';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authUser] = useAuthUser();

  if (!authUser) {
    return (
      <Center>
        <Button component={Link} href='/login'>
          Login
        </Button>
      </Center>
    );
  }

  return <>{children}</>;
}
