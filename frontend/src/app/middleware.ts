import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Public paths that don't require authentication
    const publicPaths = ["/login", "/signup", "/", "/api/auth", "/auth/signin", "/auth/signup"];
    if (publicPaths.includes(path)) {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Role-based access control
    const role = token.role?.toLowerCase();
    
    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    if (path.startsWith("/lecturer") && role !== "lecturer") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    if (path.startsWith("/student") && role !== "student") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Redirect /lecturer/dashboard to /lecturer
    if (path === "/lecturer/dashboard") {
      return NextResponse.redirect(new URL("/lecturer", req.url));
    }

    // Redirect /admin/dashboard to /admin
    if (path === "/admin/dashboard") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
