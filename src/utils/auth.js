// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

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
