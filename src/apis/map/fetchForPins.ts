import { Position } from "@/types/map/Props";
import { baseFetch } from "../baseFetch";

export const fetchForPins = async (bounds: { northEast: Position, southWest: Position }) => {
    try {
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