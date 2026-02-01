import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { setTokens, setAuthCallbacks } from '@/services/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  lastProfileCheck: number;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHydrated: () => void;
  setLastProfileCheck: (timestamp: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,
      lastProfileCheck: 0,

      setAuth: (user, accessToken, refreshToken) => {
        setTokens(accessToken, refreshToken);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      setTokens: (accessToken, refreshToken) => {
        setTokens(accessToken, refreshToken);
        set({
          accessToken,
          refreshToken,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      logout: () => {
        setTokens(null, null);
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setHydrated: () => {
        const state = get();
        if (state.accessToken && state.refreshToken) {
          setTokens(state.accessToken, state.refreshToken);
        }
        set({ isHydrated: true });
      },

      setLastProfileCheck: (timestamp) => {
        set({ lastProfileCheck: timestamp });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        lastProfileCheck: state.lastProfileCheck,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

setAuthCallbacks(
  (tokens) => {
    useAuthStore
      .getState()
      .setTokens(tokens.access_token, tokens.refresh_token);
  },
  () => {
    useAuthStore.getState().logout();
  },
);
