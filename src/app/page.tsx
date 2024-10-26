"use client";

import Map from "@/components/Map/Map";
import useUserLocation from "@/hooks/map/useUserLocation";

export default function Home() {
  const userLocation = useUserLocation();
  console.log(userLocation);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">지도 기반 커뮤니티</h1>
      {userLocation ? (
        <Map 
          initialCenter={userLocation}
          initialZoom={13}
          onMarkerCreate={(position) => {
            console.log('New marker position:', position);
          }}
        />
      ) : (
        <Map 
          initialCenter={{ lat: 37.5665, lng: 126.9780 }}
          initialZoom={13}
          onMarkerCreate={(position) => {
            console.log('New marker position:', position);
          }}
        />
      )}
    </main>
  );
}
