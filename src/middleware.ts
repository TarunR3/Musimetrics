import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { pathname } = req.nextUrl;

    if (pathname.includes('api/auth') || token || PUBLIC_FILE.test(pathname) || pathname.includes('/about')) {
        return NextResponse.next();
    }

    if (!token && pathname !== "/login") {
        //console.log(pathname)
        //console.log(req.url)
        return NextResponse.redirect(new URL('/login', req.url))
    }
}