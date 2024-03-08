"use server";

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

const allowedOrigins = [
    'http://localhost:3000',
];

export async function middleware(req) {
    const origin = req.headers.get('origin');

    const res = NextResponse.next();

    if (origin && !allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
            status: 400,
            statusText: "Bad Request",
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }

    const supabase = createMiddlewareClient({ req, res });

    const { data: { user }, } = await supabase.auth.getUser();

    if (user && req.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/chat', req.url));
    }

    if (!user && req.nextUrl.pathname.startsWith('/chat')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (user && req.nextUrl.pathname.startsWith('/chat/')) {
        return NextResponse.rewrite(new URL('/chat', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}