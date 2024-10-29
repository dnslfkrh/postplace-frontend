import { NextRequest, NextResponse } from "next/server"

export const middleware = async (req: NextRequest) => {
    const accessToken = req.cookies.get("accessToken");
    const refreshToken = req.cookies.get("refreshToken");


    if (!accessToken) {
        if (!refreshToken) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/refresh`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${refreshToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const newAccessToken = data.accessToken;
            const res = NextResponse.next();

            res.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
            });

            return res;
        } else {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
};

export const config = {
    matcher: ['/'],
};
