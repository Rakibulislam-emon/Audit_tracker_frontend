// import { jwtVerify } from "jose";
// import { NextResponse } from "next/server";

// export async function middleware(request) {
//   const token = request.cookies.get("token")?.value;
//   const currentPath = request.nextUrl.pathname;

//   // ❌ হোমপেজ ("/") কে public route থেকে বাদ দিন!
//   const publicRoutes = ["/auth/login"];
//   const isPublicRoute = publicRoutes.some(
//     (route) => currentPath === route || currentPath.startsWith(route + "/")
//   );

//   // Skip static files
//   if (
//     currentPath.startsWith("/_next") ||
//     currentPath.startsWith("/favicon.ico") ||
//     currentPath.match(/\.(png|jpg|jpeg|svg|gif|ico)$/i)
//   ) {
//     return NextResponse.next();
//   }

//   // Public routes (শুধু /auth/login)
//   if (isPublicRoute) {
//     if (token) {
//       try {
//         const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//         const { payload } = await jwtVerify(token, secret);
//         // লগইন করা থাকলে /auth/login এ থাকা উচিত না → ড্যাশবোর্ডে পাঠান
//         return NextResponse.redirect(
//           new URL(`/dashboard/${payload.role}`, request.url)
//         );
//       } catch {
//         // Invalid token → allow access to login page
//         return NextResponse.next();
//       }
//     }
//     return NextResponse.next();
//   }

//   // 🔒 সবকিছুই protected — যেমন: /, /dashboard, ইত্যাদি
//   if (!token) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }

//   try {
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     const { payload } = await jwtVerify(token, secret);
//     const role = payload.role;

//     const allowedRoles = ["admin", "auditor", "compliance"];
//     if (!allowedRoles.includes(role)) {
//       return NextResponse.redirect(new URL("/auth/login", request.url));
//     }

//     // ✅ যদি কেউ "/" এ আসে → তাকে তার ড্যাশবোর্ডে পাঠান
//     if (currentPath === "/") {
//       return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
//     }

//     // ড্যাশবোর্ড রোল ভ্যালিডেশন
//     if (
//       currentPath.startsWith("/dashboard") &&
//       !currentPath.startsWith(`/dashboard/${role}`)
//     ) {
//       return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
//     }

//     return NextResponse.next();
//   } catch (error) {
//     console.error("Auth failed:", error.message);
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif)$).*)",
//   ],
// };

import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const currentPath = request.nextUrl.pathname;

  console.log(`\n--- [Middleware Log] ---`);
  console.log(`Path: ${currentPath}`);
  console.log(
    `Token found: ${
      token ? "Yes (truncated: " + token.substring(0, 15) + "...)" : "No"
    }`
  ); // ❌ হোমপেজ ("/") কে public route থেকে বাদ দিন!

  const publicRoutes = ["/auth/login"];
  const isPublicRoute = publicRoutes.some(
    (route) => currentPath === route || currentPath.startsWith(route + "/")
  ); // Skip static files

  if (
    currentPath.startsWith("/_next") ||
    currentPath.startsWith("/favicon.ico") ||
    currentPath.match(/\.(png|jpg|jpeg|svg|gif|ico)$/i)
  ) {
    console.log("Static file detected, skipping.");
    return NextResponse.next();
  } // Public routes (শুধু /auth/login)

  if (isPublicRoute) {
    console.log("Route is Public");
    if (token) {
      console.log("Token found on public route, trying to verify...");
      try {
        const secretKey = process.env.JWT_SECRET;
        console.log(
          `Verifying with SECRET (first 5 chars): ${
            secretKey ? secretKey.substring(0, 5) : "NOT FOUND"
          }`
        );
        const secret = new TextEncoder().encode(secretKey);
        const { payload } = await jwtVerify(token, secret);
        console.log("Verification SUCCESS. Redirecting to dashboard.");
        return NextResponse.redirect(
          new URL(`/dashboard/${payload.role}`, request.url)
        );
      } catch (error) {
        // ✅ empty catch ঠিক করা হয়েছে
        console.log(
          `Invalid token on public route, allowing. Error: ${error.message}`
        );
        return NextResponse.next();
      }
    }
    console.log("No token on public route, allowing.");
    return NextResponse.next();
  } // 🔒 সবকিছুই protected — যেমন: /, /dashboard, ইত্যাদি

  console.log("Route is Protected");
  if (!token) {
    console.log("No token found for protected route. Redirecting to login.");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  console.log("Token found for protected route, trying to verify...");
  try {
    // --- ⚠️⚠️ সবচেয়ে গুরুত্বপূর্ণ লগ ⚠️⚠️ ---
    const secretKey = process.env.JWT_SECRET;
    console.log(`[VERCEL] FULL JWT_SECRET IS: "${secretKey}"`);
    // --- ------------------------------- ---

    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, secret);
    console.log(`Token verification SUCCESS. Payload role: ${payload.role}`);
    const role = payload.role;

    const allowedRoles = ["admin", "auditor", "compliance", "manager"];
    if (!allowedRoles.includes(role)) {
      console.log(`Role NOT ALLOWED. Role: ${role}. Redirecting to login.`);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    } // ✅ যদি কেউ "/" এ আসে → তাকে তার ড্যাশবোর্ডে পাঠান

    if (currentPath === "/") {
      console.log("Root path detected. Redirecting to dashboard.");
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    } // ড্যাশবোর্ড রোল ভ্যালিডেশন

    if (
      currentPath.startsWith("/dashboard") &&
      !currentPath.startsWith(`/dashboard/${role}`)
    ) {
      console.log(
        `Role mismatch for dashboard. Redirecting. Path: ${currentPath}, Role: ${role}`
      );
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }

    console.log("All checks passed. Allowing access.");
    return NextResponse.next();
  } catch (error) {
    console.error(`\n!!!!!!!! AUTHENTICATION FAILED !!!!!!!!`);
    console.error(`Error Message: ${error.message}`);
    console.error(`Vercel's JWT_SECRET: "${process.env.JWT_SECRET}"`);
    console.error(
      `Render's (Expected) SECRET: "a38f3a40a3db92d845c5e61d982e44cc828765392e1fc546c88f88f1b50e4c47"`
    );
    console.error(`Are they EXACTLY the same? (Check for spaces)`);
    console.error(`Redirecting to login.`);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif)$).*)",
  ],
};
