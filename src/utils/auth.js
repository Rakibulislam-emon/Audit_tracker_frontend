// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

import { useAuthStore } from "@/stores/useAuthStore";

// const getToken = () => {
//   const cookieStore = cookies();
//   return cookieStore.get("token")?.value;
// };

// const isTokenValid = (token) => {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded;
//   } catch (error) {
//     console.log("Token validation error:", error.message);
//     return null;
//   }
// };

// const redirectTo = () => {
//     // get token from cookies
//     const token = getToken();
//     // decode token
//     if (token) {
//         const {role} = isTokenValid(token)
//         if(role) redirectByRole(role)
//     }
// }

// const rolePaths = {
//     admin: "/dashboard/admin",
//     auditor: "/dashboard/auditor",
// }

// const redirectByRole = (role) => {
//     return rolePaths[role] || "/";
// }

// export { getToken, isTokenValid,  redirectByRole, redirectTo };

// logout

const handleLogout = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    //   clear cache
     cache: "no-store"
    });

    // Clear Zustand state
    useAuthStore.getState().logout();

    // Redirect
    window.location.href = "/auth/login";
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

export { handleLogout };
