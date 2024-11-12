import { baseFetch } from "../baseFetch";

export const fetchForPins = async (bounds: {
    northEast: { latitude: number; longitude: number },
    southWest: { latitude: number; longitude: number }
}) => {
    try {
        console.log("요청 시작");

        const { northEast, southWest } = bounds;
        const query = `?neLat=${northEast.latitude}&neLng=${northEast.longitude}&swLat=${southWest.latitude}&swLng=${southWest.longitude}`;

        const response = await baseFetch(`/map/get/pins${query}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("핀 가져오기 실패..");
        }

        return await response.json();
    } catch (error) {
        console.error("오류 발생: ", error);
        throw error;
    }
};