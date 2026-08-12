import { useEffect } from 'react';

import useAuthUser from '#hooks/useAuthUser';
import { getProfile } from '#services/auth';

export default function AuthValidate() {
  const [, setAuthUser] = useAuthUser();

  useEffect(() => {
    getProfile()
      .then((user) => {
        setAuthUser(user);
      })
      .catch((res) => {
        if (res.response?.status === 401) {
          setAuthUser(null);
        }
      });
  }, [setAuthUser]);

  return null;
}
