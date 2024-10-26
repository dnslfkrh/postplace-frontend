"use client";

import { useEffect, useRef, useState } from "react";
import { MapProps } from "@/types/map/map.props";
import { isSouthKorea, SOUTH_KOREA_BOUNDARY } from "@/utils/map/geoValidation";

declare global {
    interface Window {
        naver: any;
    }
}

export default function Map({ initialCenter, initialZoom, onMarkerCreate }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);

    useEffect(() => {
        const loadMap = () => {
            if (!mapRef.current || !window.naver) return;

            const mapInstance = new window.naver.maps.Map(mapRef.current, {
                center: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
                zoom: initialZoom,
                minZoom: 11,
                maxZoom: 21,
                mapTypeId: window.naver.maps.MapTypeId.NORMAL,
                mapTypeControl: false,
                zoomControl: false,
                scaleControl: false,
                mapDataControl: false,
            });

            setMap(mapInstance);

            window.naver.maps.Event.addListener(mapInstance, "click", (e: any) => {
                const position = {
                    lat: e.coord.y,
                    lng: e.coord.x
                };

                if (!isSouthKorea(position)) {
                    alert("대한민국 영토를 선택해 주십시오.");
                    return;
                }

                const marker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(position.lat, position.lng),
                    map: mapInstance
                });

                onMarkerCreate?.(position);
            });

            return () => {
                mapInstance?.destroy();
            };
        };

        const initializeMap = () => {
            if (window.naver) {
                loadMap();
            } else {
                const script = document.createElement('script');
                script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`;
                script.async = true;
                script.onload = loadMap;
                document.head.appendChild(script);
            }
        };

        initializeMap();

        return () => {
            setMap(null);
        };
    }, [initialCenter, initialZoom]);

    const displayMarkers = (markers: { id: string; position: { lat: number; lng: number } }[]) => {
        if (!map) {
            return;
        }

        markers.forEach(markerData => {
            if (isSouthKorea(markerData.position)) {
                const marker = new window.naver.maps.Marker({
                    position: new window.naver.maps.LatLng(
                        markerData.position.lat,
                        markerData.position.lng
                    ),
                    map: map
                });

                window.naver.maps.Event.addListener(marker, 'click', () => {
                    console.log('Marker clicked:', markerData.id);
                });
            }
        });
    };

    return (
        <div className="w-full h-screen relative">
            <div ref={mapRef} className="w-full h-full" />
        </div>
    );
}
