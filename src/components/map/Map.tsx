import { useEffect, useState } from 'react';
import { MapProps } from '@/types/map/Props';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { isSouthKorea } from '@/utils/map/geoValidation';

export default function Map({ center, zoom }: MapProps) {
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
                    disableDefaultUI: true,
                    zoomControl: true,
                    clickableIcons: false,
                    mapId: process.env.NEXT_PUBLIC_MAP_ID,
                });

                const markerCluster = new MarkerClusterer({ map });

                // 지오코더 초기화
                const geocoderInstance = new google.maps.Geocoder();
                setGeocoder(geocoderInstance);

                // 초기 마커 추가: 위치가 대한민국인지 확인 후 추가
                geocoderInstance.geocode({ location: center }, (results: google.maps.GeocoderResult[] | undefined, status: google.maps.GeocoderStatus) => {
                    if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                        const address = results[0].formatted_address;
                        console.log('초기 주소:', address);

                        if (isSouthKorea(address)) {
                            addMarker(center, map, markerCluster); // 대한민국이면 마커 추가
                        } else {
                            console.warn('초기 위치는 대한민국 외부입니다. 마커를 추가하지 않았습니다.');
                        }
                    } else {
                        console.error('지오코딩 실패:', status);
                    }
                });

                map.addListener('click', async (event: google.maps.MapMouseEvent) => {
                    if (event.latLng) {
                        const position = event.latLng.toJSON();

                        geocoderInstance.geocode({ location: position }, (results: google.maps.GeocoderResult[] | undefined, status: google.maps.GeocoderStatus) => {
                            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                                const address = results[0].formatted_address;
                                console.log('주소:', address);

                                if (isSouthKorea(address)) {
                                    addMarker(position, map, markerCluster);
                                    alert('이 위치는 대한민국 내에 있습니다. 마커가 추가되었습니다.');
                                } else {
                                    alert('이 위치는 대한민국 외부입니다. 마커를 추가할 수 없습니다.');
                                }
                            } else {
                                console.error('지오코딩 실패:', status);
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
