// import jwt from "jsonwebtoken";

import { useAuthStore } from "@/stores/useAuthStore";

export const handleLogout = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
      //   clear cache
      cache: "no-store",
    });

    // Clear Zustand state
    useAuthStore.getState().logout();

    // Redirect
    window.location.href = "/auth/login";
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
