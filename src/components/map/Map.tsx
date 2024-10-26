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
                minZoom: 6,
                maxZoom: 21,
                mapTypeId: window.naver.maps.MapTypeId.NORMAL,
                mapTypeControl: true,
                zoomControl: true,
                scaleControl: true,
                mapDataControl: true,
                bounds: new window.naver.maps.LatLngBounds(
                    new window.naver.maps.LatLng(SOUTH_KOREA_BOUNDARY.south, SOUTH_KOREA_BOUNDARY.west),
                    new window.naver.maps.LatLng(SOUTH_KOREA_BOUNDARY.north, SOUTH_KOREA_BOUNDARY.east)
                )
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

        if (window.naver) {
            loadMap();
        } else {
            const handleScriptLoad = () => {
                loadMap();
            };
            window.addEventListener("load", handleScriptLoad);

            return () => {
                window.removeEventListener("load", handleScriptLoad);
            };
        }
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
        <div className="w-full h-[500px] relative">
            <div ref={mapRef} className="w-full h-full" />
        </div>
    );
}
