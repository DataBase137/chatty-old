"use server"

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://chatty-fiao-dbs-projects-6f654fbd.vercel.app",
  "https://chattyapp.vercel.app",
  "https://chatty-db37.vercel.app",
]

export async function middleware(req) {
  // Get the origin from request headers
  const origin = req.headers.get("origin")

  // Create a NextResponse object
  const res = NextResponse.next()

  // Check if origin is allowed
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad Request",
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }

  // Create Supabase client with middleware
  const supabase = createMiddlewareClient({ req, res })

  // Get user information
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to /chat if user is authenticated and not on /chat
  if (user && !req.nextUrl.pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/chat", req.url))
  }

  // Redirect to /login if user is not authenticated and on /chat
  if (!user && req.nextUrl.pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Rewrite /chat/:chatId to /chat
  if (user && req.nextUrl.pathname.startsWith("/chat/")) {
    return NextResponse.rewrite(new URL("/chat", req.url))
  }

  // Proceed to page if none of the conditions match
  return NextResponse.next()
}

// Configuration for which paths the middleware will apply to
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
