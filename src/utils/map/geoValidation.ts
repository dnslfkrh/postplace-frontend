import { CoordinateProps } from "@/types/map/map.props";

// 핀포인트 가능한 대한민국 영토
export const SOUTH_KOREA_BOUNDARY = {
    north: 38.20, // DMZ 남쪽 경계부터
    south: 33.11, // 제주도 남단까지
    east: 131.87, // 독도부터
    west: 125.07 // 서해 최서단까지
};

export function isSouthKorea(coordinate: CoordinateProps): boolean {
    const { lat, lng } = coordinate;

    return (
        lat <= SOUTH_KOREA_BOUNDARY.north &&
        lat >= SOUTH_KOREA_BOUNDARY.south &&
        lng <= SOUTH_KOREA_BOUNDARY.east &&
        lng >= SOUTH_KOREA_BOUNDARY.west
    );
}
