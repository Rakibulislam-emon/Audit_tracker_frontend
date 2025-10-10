// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       // Initial state
//       user: null,
//       token: null,
//       isLoading: false,

//       // Actions
//       setUser: (user) => set({ user }),
//       setToken: (token) => set({ token }),
//       setLoading: (isLoading) => set({ isLoading }),
      
//       login: (userData, token) => {
//         set({ user: userData, token, isLoading: false });
//         // Optional: You can also set the token in cookies here
//         // document.cookie = `token=${token}; path=/; max-age=86400`; // 1 day
//       },
      
//       logout: () => {
//         set({ user: null, token: null, isLoading: false });
//         localStorage.removeItem('auth-storage');
//       },

//       // Utility methods
//       isAuthenticated: () => !!get().user && !!get().token,
//       isAdmin: () => get().user?.role === 'admin',
//       isAuditor: () => get().user?.role === 'auditor',
//       isManager: () => get().user?.role === 'manager',
      
//       // Check if user has specific role
//       hasRole: (role) => get().user?.role === role,
      
//       // Get user initials for avatar
//       getUserInitials: () => {
//         const user = get().user;
//         if (!user?.name) return 'U';
//         return user.name
//           .split(' ')
//           .map(word => word.charAt(0))
//           .join('')
//           .toUpperCase()
//           .slice(0, 2);
//       }
//     }),
//     {
//       name: 'auth-storage',
//       // Store both user and token for persistence across refreshes
//       partialize: (state) => ({ 
//         user: state.user, 
//         token: state.token 
//       }),
//     }
//   )
// );




import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),

// get user role
      getUserRole: () => get().user &&  get().user.role,

      login: (userData, token) => {
        set({ user: userData, token, isLoading: false });
      },

      logout: () => {
        set({ user: null, token: null, isLoading: false });
        localStorage.removeItem('auth-storage');
      },

      isAuthenticated: () => !!get().user && !!get().token,
      isAdmin: () => get().user?.role === 'admin',
      isAuditor: () => get().user?.role === 'auditor',
      isManager: () => get().user?.role === 'manager',

      hasRole: (role) => get().user?.role === role,

      getUserInitials: () => {
        const user = get().user;
        if (!user?.name) return 'U';
        return user.name
          .split(' ')
          .map((word) => word.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 2);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
