import { saveTokenToLocalStorage } from "@/utils/cookie/localStorage";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export const useGoogleAuth = () => {
    const router = useRouter();

    useEffect(() => {
        const url = new URL(window.location.href);
        const token = url.searchParams.get("token");

        if (token) {
            saveTokenToLocalStorage(token);
            router.push("/main");
        }
    }, [router]);
};