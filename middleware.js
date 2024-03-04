"use server";

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
    const res = NextResponse.next();
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res });

    // Refresh session if expired - required for Server Components
    const { data: { user }, } = await supabase.auth.getUser();

    // if user is signed in and the current path is / redirect the user to /chat
    if (user && req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/chat', req.url));
    }

    // if user is not signed in and the current path is not / redirect the user to /
    if (!user && req.nextUrl.pathname === '/chat') {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
    /*
 * Match all request paths except for the ones starting with:
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 * Feel free to modify this pattern to include more paths.
 */
    matcher: ['/', '/chat', '/login'],
}