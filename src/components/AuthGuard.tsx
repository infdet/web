import { Redirect, useLocation, useSearch } from 'wouter';

import useAuthUser from '#hooks/useAuthUser';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authUser] = useAuthUser();
  const [location] = useLocation();
  const search = useSearch();

  if (!authUser) {
    const from = encodeURIComponent(location + '?' + search);
    return <Redirect to={`/login?from=${from}`} />;
  }

  return <>{children}</>;
}
