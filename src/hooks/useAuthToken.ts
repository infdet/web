import { useLocalStorage } from '@guoyunhe/react-storage';

export default function useAuthToken() {
  return useLocalStorage<string | null>('authToken', null);
}
