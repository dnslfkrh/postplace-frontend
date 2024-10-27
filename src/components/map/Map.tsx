import { useEffect, useState } from 'react';
import { MapProps } from '@/types/map/Props';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { isSouthKorea } from '@/utils/map/geoValidation';
import { useRouter } from 'next/navigation';
import { ConfirmModal } from './modals/ConfirmModal';
import { PostModal } from './modals/PostModal';

const MAP_OPTIONS = {
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false,
    minZoom: 10,
    maxZoom: 17
};

export const Map = ({ center, zoom }: MapProps) => {
    const router = useRouter();
    const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    const [markerCluster, setMarkerCluster] = useState<MarkerClusterer | null>(null);
    // 클릭 후 위치 확인받기
    const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(null);
    // 확인 후 게시물 작성하기
    const [showPostModal, setShowPostModal] = useState(false);

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
                setMapInstance(map);

                // 클러스터 초기화
                const markerClusterInstance = new MarkerClusterer({ map });
                setMarkerCluster(markerClusterInstance);

                // 지오코더 초기화
                const geocoderInstance = new google.maps.Geocoder();
                setGeocoder(geocoderInstance);

                map.addListener('click', async (event: google.maps.MapMouseEvent) => {
                    if (event.latLng) {
                        const position = event.latLng.toJSON();

                        // 지오코더 (좌표 => 주소 변환)
                        geocoderInstance.geocode({ location: position }, (results: google.maps.GeocoderResult[] | undefined, status: google.maps.GeocoderStatus) => {
                            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                                const address = results[0].formatted_address;
                                console.log('주소:', address);

                                // 대한민국 주소인지 검증
                                if (isSouthKorea(address)) {
                                    setSelectedPosition(position);
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

    const handleConfirmSelectPlace = () => {
        if (selectedPosition && mapInstance && markerCluster) {
            setShowPostModal(true);
            setSelectedPosition(null);
        }
    };

    const handleCancelSelectPlace = () => {
        setSelectedPosition(null);
    };

    const handleClosePostModal = () => {
        setShowPostModal(false);
    };

    return (
        <div className="h-full w-full relative">
            <div id="map" className="h-full w-full" />

            {selectedPosition && (
                <ConfirmModal
                    message="핀포인트 추가하기"
                    onConfirm={handleConfirmSelectPlace}
                    onCancel={handleCancelSelectPlace}
                />
            )}

            {showPostModal && (
                <PostModal onClose={handleClosePostModal} />
            )}
        </div>
    );
}
