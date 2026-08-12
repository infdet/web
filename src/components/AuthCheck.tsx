import { useEffect } from 'react';
import xior from 'xior';

import useAuthToken from '#hooks/useAuthToken';

export default function AuthCheck() {
  const [authToken] = useAuthToken();

  useEffect(() => {
    if (authToken) {
      xior.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      xior.get('/account/profile').catch(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      });

      fetch(`${import.meta.env.VITE_API_URL}auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
          }
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
        });
    }
  }, [authToken]);

  return null;
}
