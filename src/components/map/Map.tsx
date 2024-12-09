import { useEffect, useRef, useState } from 'react';
import { MapProps, NewArticleProps, PinPropsInMap } from '@/types/map/Props';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { ConfirmModal } from './modals/ConfirmModal';
import { PostModal } from './modals/PostModal';
import { fetchToCreateArticle } from '@/apis/map/fetchToCreateArticle';
import { fetchForPins } from '@/apis/map/fetchForPins';
import { CurrentCenterPostModal } from './modals/CurrentCenterPostModal';

const MAP_OPTIONS = {
    disableDefaultUI: true,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    clickableIcons: false,
    minZoom: 10,
    maxZoom: 20
};

export const Map = ({ center, zoom }: MapProps) => {
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
    const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
    const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    const [markerCluster, setMarkerCluster] = useState<MarkerClusterer | null>(null);
    const [selectedPosition, setSelectedPosition] = useState<google.maps.LatLngLiteral | null>(null);
    const [selectedPin, setSelectedPin] = useState<PinPropsInMap | null>(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showCurrentCenterModal, setShowCurrentCenterModal] = useState(false);
    const [pinTitleModal, showPinTitleModal] = useState(false);

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

                // place 검색
                if (searchInputRef.current) {
                    const autoComplete = new google.maps.places.Autocomplete(searchInputRef.current);
                    autoComplete.bindTo('bounds', map);

                    autoComplete.addListener('place_changed', () => {
                        const place = autoComplete.getPlace();
                        if (place.geometry) {
                            map.setCenter(place.geometry.location);
                            map.setZoom(20);
                            // 위치 확용용 임시 마커 보여줘여ㅑ됨
                        } else {
                            alert("검색 오류: 다시 시도해 주세요.");
                        }

                        if (searchInputRef.current) {
                            searchInputRef.current.value = "";
                            handleBlur();
                        }
                    })
                }

                // 지도 클릭 이벤트 설정 :: 핀 게시물 추가
                map.addListener('click', async (event: google.maps.MapMouseEvent) => {
                    if (isFocused) {
                        return;
                    }

                    if (event.latLng) {
                        const position = event.latLng.toJSON();
                        geocoderInstance.geocode({ location: position }, (results: google.maps.GeocoderResult[] | undefined, status: google.maps.GeocoderStatus) => {
                            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                                const country = results[0].address_components.find((component) => component.types.includes('country'));
                                const address = results[0].formatted_address;
                                console.log('주소:', address);

                                if (country?.short_name === 'KR') {
                                    setSelectedPosition(position);
                                } else {
                                    alert("대한민국 영토를 선택해 주세요.");
                                }
                            } else {
                                console.error("Geocoding 오류", status);
                            }
                        });
                    }
                });

                map.addListener('dragstart', () => {
                    if (infoWindowRef.current) {
                        infoWindowRef.current.close();
                    }
                });
            }
        };

        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places,marker`;
            script.async = true;
            script.defer = true;
            script.onload = loadMap;
            document.body.appendChild(script);
        } else {
            loadMap();
        }
    }, [center, zoom]);

    useEffect(() => {
        const loadPins = async () => {
            if (!mapInstance) {
                return;
            }

            const bounds = mapInstance.getBounds();
            if (!bounds) {
                return;
            }

            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();

            // 기존 화면의 마커 제거
            if (markers && markers.length > 0) {
                markers.forEach((marker) => {
                    marker.map = null;
                });
                setMarkers([]);
            }

            markerCluster?.clearMarkers();

            try {
                showPinTitleModal(false);
                setSelectedPin(null);

                const pins = await fetchForPins({
                    northEast: { latitude: ne.lat(), longitude: ne.lng() },
                    southWest: { latitude: sw.lat(), longitude: sw.lng() }
                });

                pins.forEach((pin: PinPropsInMap) => {
                    addMarker(pin);
                });
            } catch (error) {
                console.error("핀포인트 가져오기 오류: ", error);
            }
        };

        if (mapInstance) {
            google.maps.event.addListener(mapInstance, 'idle', loadPins);
        }
    }, [mapInstance]);

    const addMarker = (pin: PinPropsInMap) => {
        if (!mapInstance) {
            console.error("Map instance is not initialized.");
            return;
        }

        console.log("Latitude:", pin.latitude, "Longitude:", pin.longitude);

        const position = new google.maps.LatLng(pin.latitude, pin.longitude);

        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: position,
            map: mapInstance,
        });

        marker.addListener('click', () => {
            setSelectedPin(pin);

            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }

            infoWindowRef.current = new google.maps.InfoWindow({
                content: `<h3 class="text-sm font-semibold text-gray-800 whitespace-nowrap">${pin.title}</h3>`,
                position: position,
                pixelOffset: new google.maps.Size(0, -45),
            });

            infoWindowRef.current.open(mapInstance);
        });

        markerCluster?.addMarker(marker);
        setMarkers((prevMarkers) => {
            return [...prevMarkers, marker];
        });
    };

    const handleOpenPostModal = (position: google.maps.LatLngLiteral) => {
        setSelectedPosition(position);
        setShowPostModal(true);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleClickCurrentPositionButton = () => {
        setShowCurrentCenterModal(true);
    };

    const handleSubmitPost = async (postData: NewArticleProps) => {
        try {
            console.log("게시물 등록:", postData);
            if (postData) {
                const articleData: NewArticleProps = {
                    title: postData.title,
                    content: postData.content,
                    position: {
                        latitude: postData.position.latitude,
                        longitude: postData.position.longitude,
                    },
                };

                const pin: PinPropsInMap = await fetchToCreateArticle(articleData);

                addMarker(pin);

                alert("마커가 등록되었습니다!");
            }
        } catch (error) {
            console.error("게시물 등록 중 오류 발생:", error);
        }
    }

    const handleCloseCurrentCenterModal = () => {
        setShowCurrentCenterModal(false);
    };

    return (
        <div className="h-full w-full relative">
            {/* 검색 */}
            <input
                ref={searchInputRef}
                type="text"
                placeholder="어디로 가고 싶은가요?"
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 bg-white border border-gray-300 shadow-md z-10 text-gray-900 transition-all duration-300
                    ${isFocused
                        ? 'top-[30%] w-4/5 sm:w-1/2 rounded-sm focus:outline-none border-gray-700 bg-opacity-90'
                        : 'top-[80%] w-2/3 sm:w-1/5 rounded-xl bg-opacity-70'}`}
            />

            {/* 지도 */}
            <div
                id="map"
                className="h-full w-full"
            />

            {/* 지도 클릭 후 현재 위치 확인 모달 */}
            {selectedPosition && !showPostModal && (
                <ConfirmModal
                    message="이 위치에 마커 추가하기"
                    onConfirm={() => handleOpenPostModal(selectedPosition)}
                    onCancel={() => setSelectedPosition(null)}
                />
            )}

            {/* 지도 클릭 후 게시물 작성 모달 */}
            {showPostModal && selectedPosition && (
                <PostModal
                    onClose={() => {
                        setShowPostModal(false);
                        setSelectedPosition(null);
                    }}
                    onSubmit={(postData) => handleSubmitPost(postData)}
                    position={{
                        latitude: selectedPosition.lat,
                        longitude: selectedPosition.lng,
                    }}
                />
            )}

            {/* 현재 위치에 마커 추가하는 팝업 버튼 */}
            {!isFocused && (
                <button
                    className="absolute bottom-10 right-10 p-4 bg-gray-800 text-white text-xl rounded-full shadow-md z-10"
                    style={{ width: '60px', height: '60px', fontSize: '36px' }}
                    onClick={handleClickCurrentPositionButton}
                >
                    +
                </button>
            )}

            {/* 현재 위치에 게시물 작성하는 모달 */}
            {showCurrentCenterModal && (
                <CurrentCenterPostModal
                    onClose={handleCloseCurrentCenterModal}
                    onSubmit={handleSubmitPost}
                    mapInstance={mapInstance}
                />
            )}
        </div>
    );
};