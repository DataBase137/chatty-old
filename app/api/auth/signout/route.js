import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// * POST request handler
export async function POST(request) {
  // Parse the request URL
  const requestUrl = new URL(request.url)

  // Extract cookies from the request headers
  const cookieStore = cookies()

  // Create Supabase client with extracted cookies
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  // Sign out user
  await supabase.auth.signOut()

  // Redirect user to login page
  return NextResponse.redirect(`${requestUrl.origin}/login`, {
    status: 301,
  })
}
