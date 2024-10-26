import { useEffect, useState } from "react";

export default function useUserLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocation({ lat: 37.5665, lng: 126.9780 });
          }
        );
      }
    };

    fetchUserLocation();
  }, []);

  return location;
};