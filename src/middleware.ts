import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ Allow NextAuth internal routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const token = await getToken({ req: request })

  // ❌ Guest accessing dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // ❌ Logged-in user accessing auth pages
  if (
    token &&
    (pathname === "/sign-in" ||
      pathname === "/sign-up" ||
      pathname.startsWith("/verify") ||
      pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/",
  ],
}
