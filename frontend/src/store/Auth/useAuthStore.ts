import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../../modules/auth/types/auth.types';

interface AuthStoreTypes {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStoreTypes>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      login: (user, token) =>
        set({
          user,
          token,
          isLoggedIn: true,
        }),
      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),
      setToken: (token) =>
        set((state) => ({
          ...state,
          token,
          isLoggedIn: Boolean(token),
        })),
      logout: () =>
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);