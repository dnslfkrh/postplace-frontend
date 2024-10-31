"use client";

export const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
    };

    return (
        <button onClick={handleGoogleLogin}>Login with Google</button>
    );
};