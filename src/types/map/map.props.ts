// 핀포인트 위도 경도가 대한민국 영토인지 검사하기 위한 타입
export interface CoordinateProps {
    lat: number;
    lng: number;
};

export interface MapProps {
    initialCenter: {
        lat: number,
        lng: number
    };
    initialZoom: number;
    onMarkerCreate?: (
        position: {
            lat: number,
            lng: number
        }
    ) => void | undefined;
};

export interface Marker {
    id: string;
    position: {
        lat: number,
        lng: number
    };
};

