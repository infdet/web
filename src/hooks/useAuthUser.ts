import { useLocalStorage } from '@guoyunhe/react-storage';

import type User from '#types/User';

export default function useAuthUser() {
  return useLocalStorage<User | null>('authUser', null);
}
