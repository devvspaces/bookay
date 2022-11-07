// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';

export function middleware(request: NextRequest) {

    const loginUrl = NextResponse.redirect(new URL('/login', request.url));

    // Check if user is logged in
    if (!request.cookies.get("username")?.value) {
        return loginUrl;
    }

    if (request.nextUrl.pathname.startsWith("/shop")) {

        // Check if logged in user is seller
        if (!request.cookies.get("isSeller")?.value) {
            return loginUrl;
        }

    }

}

export const config = {
    matcher: [
        '/app/:path*', // Match all paths starting with /app
        '/shop/:path*', // Match all paths starting with /shop
        '/logout',
    ],
}