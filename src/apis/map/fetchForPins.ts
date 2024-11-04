import { baseFetch } from "../baseFetch";

export const fetchForPins = async () => {
    try {
        const response = await baseFetch("/map/read/pins", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("핀 가져오기 실패..");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("오류 발생: ", error);
        throw error;
    }
};