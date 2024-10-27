"use client";

import { Map } from "@/components/map/Map";
import useUserLocation from "@/hooks/map/useUserLocation";

export default function Home() {
  const { location: userLocation, loading } = useUserLocation();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 사용자 위치 정보를 얻지 못했을 때의 기준점
  const defaultLocation = { lat: 37.5705, lng: 126.9769 };

  return (
    <div style={{ height: '100vh' }}>
      <Map center={userLocation || defaultLocation} zoom={17} />
    </div>
  );
}
