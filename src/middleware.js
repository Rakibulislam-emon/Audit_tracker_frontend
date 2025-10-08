import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const currentPath = request.nextUrl.pathname;

  // ❌ হোমপেজ ("/") কে public route থেকে বাদ দিন!
  const publicRoutes = ["/auth/login"];
  const isPublicRoute = publicRoutes.some(
    (route) => currentPath === route || currentPath.startsWith(route + "/")
  );

  // Skip static files
  if (
    currentPath.startsWith("/_next") ||
    currentPath.startsWith("/favicon.ico") ||
    currentPath.match(/\.(png|jpg|jpeg|svg|gif|ico)$/i)
  ) {
    return NextResponse.next();
  }

  // Public routes (শুধু /auth/login)
  if (isPublicRoute) {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        // লগইন করা থাকলে /auth/login এ থাকা উচিত না → ড্যাশবোর্ডে পাঠান
        return NextResponse.redirect(
          new URL(`/dashboard/${payload.role}`, request.url)
        );
      } catch {
        // Invalid token → allow access to login page
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 🔒 সবকিছুই protected — যেমন: /, /dashboard, ইত্যাদি
  if (!token) {
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

    // ✅ যদি কেউ "/" এ আসে → তাকে তার ড্যাশবোর্ডে পাঠান
    if (currentPath === "/") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }

    // ড্যাশবোর্ড রোল ভ্যালিডেশন
    if (
      currentPath.startsWith("/dashboard") &&
      !currentPath.startsWith(`/dashboard/${role}`)
    ) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth failed:", error.message);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif)$).*)",
  ],
};
