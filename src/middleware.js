import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const currentPath = request.nextUrl.pathname;

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

  // Public route logic
  if (isPublicRoute) {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return NextResponse.redirect(
          new URL(`/dashboard/${payload.role}`, request.url)
        );
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Protected routes
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
    "/dashboard/:path*", // protect all dashboard routes
    "/auth/login",
    "/", // home
  ],
};
