"use client";

import Map from "@/components/map/Map";
import NaverMapScript from "@/components/map/NaverMapScript";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <NaverMapScript />
      <h1 className="text-2xl font-bold mb-4">지도 기반 커뮤니티</h1>
      <Map 
        initialCenter={{ lat: 37.5665, lng: 126.9780 }}
        initialZoom={13}
        onMarkerCreate={(position) => {
          console.log('New marker position:', position);
        }}
      />
    </main>
  );
}