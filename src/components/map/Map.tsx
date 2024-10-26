"use client";

import { useEffect, useState } from 'react';
import { MapProps } from '@/types/map/Props';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

export default function Map({ center, zoom }: MapProps) {
    const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);

    useEffect(() => {
        const loadMap = async () => {
            const { google } = window as any;
            const mapElement = document.getElementById('map') as HTMLElement;

            if (mapElement && google) {
                const map = new google.maps.Map(mapElement, {
                    center,
                    zoom,
                    disableDefaultUI: true,
                    zoomControl: true,
                    mapId: "WhereWeIt",
                });

                // 클러스터 디자인 수정 필요
                const markerCluster = new MarkerClusterer({ map });

                addMarker(center, map, markerCluster);

                map.addListener('click', (event: google.maps.MapMouseEvent) => {
                    if (event.latLng) {
                        const position = event.latLng.toJSON();
                        addMarker(position, map, markerCluster);
                    }
                });
            }
        };

        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=marker`;
            script.async = true;
            script.defer = true;
            script.onload = loadMap;
            document.body.appendChild(script);
        } else {
            loadMap();
        }
    }, [center, zoom]);

    const addMarker = (position: google.maps.LatLngLiteral, map: google.maps.Map, markerCluster: MarkerClusterer) => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position,
            map,
            title: '새 마커',
        });

        marker.addListener('click', () => {
            console.log('새 마커 클릭됨!');
        });

        markerCluster.addMarker(marker);
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
    };

    return (
        <div id="map" className="h-full w-full" />
    );
}
