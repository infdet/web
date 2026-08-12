import { useLocation } from 'wouter';

import useAuthUser from '#hooks/useAuthUser';
import { logout, setAuthToken } from '#services/auth';

export default function useLogout() {
  const [, setAuthUser] = useAuthUser();
  const [, navigate] = useLocation();

  return async () => {
    try {
      await logout();
    } catch {
      // ignore logout API errors
    }
    setAuthToken('');
    setAuthUser(null);
    navigate('/login');
  };
}
