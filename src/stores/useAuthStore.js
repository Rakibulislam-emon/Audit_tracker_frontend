// src/stores/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ✅ Persist: localStorage-এ user data সেভ করবে (শুধু client-side-এ)
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,

      // Actions
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      
      login: (userData, token) => {
        set({ user: userData, token });
      },
      
      logout: () => {
        set({ user: null, token: null });
        // Cookie clear করা হবে পরে (middleware বা logout handler-এ)
      },

      // Utility
      isAuthenticated: () => !!get().user,
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ user: state.user }), // token সেভ করব না (security)
    }
  )
);