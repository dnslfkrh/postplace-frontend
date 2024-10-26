"use client";

import Map from "@/components/Map/Map";

export default function Home() {

  return (
    <div style={{ height: '100vh' }}>
      <Map center={{ lat: 35.89162826538086, lng: 127.7489013671875 }} zoom={14} />
    </div>
  );
};