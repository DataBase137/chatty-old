"use server"

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// * GET request handler
export async function GET(request) {
  // Parse the request URL
  const requestUrl = new URL(request.url)

  // Extract the 'code' parameter from the request URL query parameters
  const code = requestUrl.searchParams.get("code")

  // If a 'code' parameter is present in the query parameters
  if (code) {
    // Extract cookies from the request headers
    const cookieStore = cookies()

    // Create Supabase client with extracted cookies
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect user to chat page
  return NextResponse.redirect(`${requestUrl.origin}/chat`)
}
