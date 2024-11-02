"use client";

export const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
    };

    return (
        <img
            src="/auth/GoogleAuthButton.png"
            alt="Login with Google"
            onClick={handleGoogleLogin}
            className="w-48 cursor-pointer"
        />
    );
};
