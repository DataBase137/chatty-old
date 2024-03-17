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

  // Sign in user
  await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Redirect user to specified callback URL
  return NextResponse.redirect(`${requestUrl.origin}/api/auth/callback`, {
    status: 301,
  })
}
