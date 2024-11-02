import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
    const hasRefreshToken = req.cookies.has("refreshToken");

    if (req.nextUrl.pathname === "/login") {
        if (hasRefreshToken) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    } else {
        if (!hasRefreshToken) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/', '/login'],
};