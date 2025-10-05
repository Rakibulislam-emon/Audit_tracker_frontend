// src/middleware.js
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const currentPath = request.nextUrl.pathname;

  // ✅ Public routes (যেগুলোতে লগইন লাগবে না)
  const publicRoutes = ["/auth/login"];

  const isPublicRoute = publicRoutes.some(
    (route) => currentPath === route || currentPath.startsWith(route + "/")
  );

  // 🚫 Static assets ছাড় দিন (Next.js-এর জন্য জরুরি)
  if (
    currentPath.startsWith("/_next") ||
    currentPath.startsWith("/favicon.ico") ||
    currentPath.match(/\.(png|jpg|jpeg|svg|gif|ico)$/i)
  ) {
    return NextResponse.next();
  }

  // 🔓 1. যদি পাবলিক রুট হয় → ছেড়ে দিন
  if (isPublicRoute) {
    // কিন্তু যদি ইউজার লগইন করা অবস্থায় থাকে → ড্যাশবোর্ডে পাঠান
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const role = payload.role;
        const dashboardPath = `/dashboard/${role}`;
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      } catch (e) {
        // Token invalid → login page-এ রাখুন
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 🔒 2. যদি প্রাইভেট রুট হয় (যেমন: /, /dashboard, ইত্যাদি)
  if (!token) {
    // লগইন না করলে → login page
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role;

    const allowedRoles = ["admin", "auditor", "compliance"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const expectedPath = `/dashboard/${role}`;

    // যদি /dashboard বা ভুল ড্যাশবোর্ডে ঢুকে থাকে
    if (currentPath.startsWith("/dashboard") && currentPath !== expectedPath) {
      return NextResponse.redirect(new URL(expectedPath, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth failed:", error.message);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// 🛡️ সব রুটে middleware apply করুন (শুধু static assets বাদ)

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif)$).*)",
  ],
};