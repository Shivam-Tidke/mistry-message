// import { withAuth } from "next-auth/middleware"
// import { NextResponse } from "next/server"

// export default withAuth(function middleware(req) {
//   const token = req.nextauth.token
//   const { pathname } = req.nextUrl

//   // ❌ Guest trying to access dashboard
//   if (!token && pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/sign-in", req.url))
//   }

//   // ❌ Logged-in user trying to access auth pages
//   if (
//     token &&
//     (pathname === "/sign-in" ||
//       pathname === "/sign-up" ||
//       pathname.startsWith("/verify"))
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", req.url))
//   }

//   return NextResponse.next()
// })

// export const config = {
//   matcher: [
//     "/",
//     "/sign-in",
//     "/sign-up",
//     "/verify/:path*",
//     "/dashboard/:path*",
//   ],
// }

import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(function middleware(req) {
  const token = req.nextauth.token
  console.log("Token:", token)

  const { pathname } = req.nextUrl

  // ❌ Not logged in → protect dashboard only
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*"],
}

