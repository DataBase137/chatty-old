"use server"

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// * POST request handler
export async function POST(request) {
  // Parse the request URL
  const requestUrl = new URL(request.url)

  // Parse the form data from the request
  const formData = await request.formData()

  // Extract email and password from the form data
  const email = formData.get("email")
  const password = formData.get("password")

  // Extract cookies from the request headers
  const cookieStore = cookies()

  // Create Supabase client with extracted cookies
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  // Sign up user
  await supabase.auth.signUp({
    email,
    password,
    options: {
      // Specify the redirect URL after successful email verification
      emailRedirectTo: `${requestUrl.origin}/api/auth/callback`,
    },
  })

  // Redirect user to verification page
  return NextResponse.redirect(`${requestUrl.origin}/verify`, {
    status: 301,
  })
}
