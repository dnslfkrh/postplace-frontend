import { useEffect, useState } from 'react';
import { MapProps } from '@/types/map/Props';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { isSouthKorea } from '@/utils/map/geoValidation';

const MAP_OPTIONS = {
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false,
    minZoom: 10,
    maxZoom: 17
};

export const Map = ({ center, zoom }: MapProps) => {
    const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

    useEffect(() => {
        const loadMap = async () => {
            const { google } = window as any;
            const mapElement = document.getElementById('map') as HTMLElement;

            if (mapElement && google) {
                const map = new google.maps.Map(mapElement, {
                    center,
                    zoom,
                    mapId: process.env.NEXT_PUBLIC_MAP_ID,
                    ...MAP_OPTIONS
                });

                // 클러스터 초기화
                const markerCluster = new MarkerClusterer({ map });

                // 지오코더 초기화
                const geocoderInstance = new google.maps.Geocoder();
                setGeocoder(geocoderInstance);

                map.addListener('click', async (event: google.maps.MapMouseEvent) => {
                    if (event.latLng) {
                        const position = event.latLng.toJSON();

                        geocoderInstance.geocode({ location: position }, (results: google.maps.GeocoderResult[] | undefined, status: google.maps.GeocoderStatus) => {
                            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                                const address = results[0].formatted_address;
                                console.log('주소:', address);

                                if (isSouthKorea(address)) {
                                    addMarker(position, map, markerCluster);
                                } else {
                                    // 클릭한 곳의 주소가 대한민국이 아닌 경우
                                    alert("대한민국 영토를 선택해 주세요.");
                                }
                            } else {
                                console.error("Geocoding 오류", status);
                            }
                        });
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
            title: "새 마커",
        });

        // 게시물과 연결 필요
        marker.addListener('click', () => {
            console.log("마커 클릭");
        });

        markerCluster.addMarker(marker);
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
    };

    // 아직은 전체화면으로 지도만 표시
    return (
        <div id="map" className="h-full w-full" />
    );
}
