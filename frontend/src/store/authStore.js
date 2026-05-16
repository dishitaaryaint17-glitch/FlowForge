import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: ({ user, token }) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      updateUser: (userPatch) => set({ user: { ...get().user, ...userPatch } }),
      isAuthenticated: () => Boolean(get().token && get().user),
    }),
    { name: 'flowforge-auth' }
  )
);
