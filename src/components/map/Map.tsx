import { useEffect, useState } from 'react';
import { MapProps, NewArticleProps } from '@/types/map/Props';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useRouter } from 'next/navigation';
import { ConfirmModal } from './modals/ConfirmModal';
import { PostModal } from './modals/PostModal';
import { fetchForCreateArticle } from '@/apis/map/fetchForCreateArticle';
import { fetchForPins } from '@/apis/map/fetchForPins';

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

                // 서버에 있는 핀포인트 가져오기
                try {
                    const [pins] = await Promise.all([
                        fetchForPins()
                    ]);

                    // 핀 저장
                    pins.forEach((pin: { position: { latitude: number; longitude: number }, title: string }) => {
                        addMarker(
                            {
                                lat: pin.position.latitude,
                                lng: pin.position.longitude
                            },
                            pin.title
                        );
                    });

                } catch (error) {
                    console.error("핀포인드 가져오기 오류: ", error);
                }

                map.addListener('click', async (event: google.maps.MapMouseEvent) => {
                    if (event.latLng) {
                        const position = event.latLng.toJSON();

                        // 지오코더 (좌표 => 주소 변환)
                        geocoderInstance.geocode({ location: position }, (results: google.maps.GeocoderResult[] | undefined, status: google.maps.GeocoderStatus) => {
                            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                                const country = results[0].address_components.find((component) => component.types.includes('country'));
                                const address = results[0].formatted_address;
                                console.log('주소:', address);

                                // 대한민국 주소인지 검증
                                if (country?.short_name === 'KR') {
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

    const addMarker = (position: { lat: number; lng: number }, title: string) => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: position, // 위치는 articleData의 position을 사용
            map: mapInstance,
            title: title, // title은 postData.title을 사용
        });

        // 게시물과 연결 필요, 현재는 제목만 로그 찍힘
        marker.addListener('click', () => {
            console.log(title);
        });

        markerCluster?.addMarker(marker);
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
    };

    // Confirm Modal에서 확인을 누르면
    const handleConfirmSelectPlace = () => {
        if (selectedPosition && mapInstance && markerCluster) {
            setShowPostModal(true);
        }
    };

    // 게시글 입력 후 등록 버튼 누르면
    const handleClosePostModal = async (postData?: { title: string, content: string }) => {
        if (postData && selectedPosition) {
            console.log("게시물 등록", postData.title, postData.content, selectedPosition);
            // addMarker(selectedPosition, postData.title, postData.content);

            // 게시글 서버 전송 시도
            const articleData: NewArticleProps = {
                title: postData.title,
                content: postData.content,
                position: {
                    latitude: selectedPosition.lat,
                    longitude: selectedPosition.lng,
                },
            };

            try {
                await fetchForCreateArticle(articleData);
                addMarker(
                    {
                        lat: articleData.position.latitude,
                        lng: articleData.position.longitude
                    },
                    articleData.title
                );

            } catch (error) {
                console.log("게시글 생성 중 오류 발생: ", error)
            }

        }
        setShowPostModal(false);
        setSelectedPosition(null);
    };

    return (
        <div className="h-full w-full relative">
            <div id="map" className="h-full w-full" />

            {selectedPosition && (
                <ConfirmModal
                    message="핀포인트 추가하기"
                    onConfirm={handleConfirmSelectPlace}
                    onCancel={() => setSelectedPosition(null)}
                />
            )}

            {showPostModal && (
                <PostModal
                    onClose={() => handleClosePostModal()}
                    onSubmit={handleClosePostModal}
                />
            )}
        </div>
    );
}
