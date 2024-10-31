"use client";

import { GoogleLoginButton } from "@/components/auth/GoogleLogainButton";
import { useGoogleAuth } from "@/hooks/auth/useAuth";

const LoginPage = () => {
    useGoogleAuth();

    return (
        <div>
            <h1>Login</h1>
            <GoogleLoginButton />
        </div>
    );
}

export default LoginPage;