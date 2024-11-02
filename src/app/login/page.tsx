"use client";

import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { PostplaceLogo } from "@/components/auth/PostplaceLogo";
import { useGoogleAuth } from "@/hooks/auth/useAuth";
import Link from "next/link";

const LoginPage = () => {
    useGoogleAuth();

    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="flex flex-col items-center space-y-3 p-8 bg-white shadow-xl rounded-lg">
                <PostplaceLogo />
                <div>포스트플레이스 시작하기</div>
                <GoogleLoginButton />
                <Link href="/policy" className="text-xs">개인정보 처리 방침</Link>
            </div>
        </div>
    );
}

export default LoginPage;