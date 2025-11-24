import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),

      // get user role
      getUserRole: () => get().user && get().user.role,

      login: (userData, token) => {
        set({ user: userData, token, isLoading: false });
        Cookies.set("token", token, {
          expires: 7, // 7 দিন
          path: "/",
          sameSite: "Lax", // Cross-domain নয়, তাই Lax ঠিক আছে
        });
      },

      // new

      logout: () => {
        set({ user: null, token: null, isLoading: false });
        localStorage.removeItem("auth-storage");
        Cookies.remove("token");
      },

      isAuthenticated: () => !!get().user && !!get().token,
      isAdmin: () => get().user?.role === "admin",
      isAuditor: () => get().user?.role === "auditor",
      isManager: () => get().user?.role === "manager",

      hasRole: (role) => get().user?.role === role,

      getUserInitials: () => {
        const user = get().user;
        if (!user?.name) return "U";
        return user.name
          .split(" ")
          .map((word) => word.charAt(0))
          .join("")
          .toUpperCase()
          .slice(0, 2);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state.setLoading(false);
      },
    }
  )
);
