"use client";

import Script from "next/script";

export default function NaverMapScript() {
    return (
        <Script
            strategy="afterInteractive"
            type="text/javascript"
            src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=clustering`}
        />
    );
}