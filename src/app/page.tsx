"use client";

import Map from "@/components/Map/Map";
import useUserLocation from "@/hooks/map/useUserLocation";

export default function Home() {
  const userLocation = useUserLocation();

  // 사용자의 위치가 아직 로딩되지 않았거나 null일 경우
  if (!userLocation) {
    return <div>로딩 중...</div>;
  }

  return (
    <div style={{ height: '100vh' }}>
      <Map center={userLocation} zoom={14} />
    </div>
  );
}
