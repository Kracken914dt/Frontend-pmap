import { getAuthUser } from '../utils/storage';

export function useAuth() {
  return {
    user: getAuthUser()
  };
}