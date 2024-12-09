import { baseFetch } from "../baseFetch";

export const fetchForSinglePin = async (pinId: number) => {
    try {
        const query = `?pinId=${pinId}`;

        const response = await baseFetch(`/map/get/pin${query}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("개별 핀 가져오기 실패..");
        }

        return await response.json();
    } catch (error) {
        console.error("오류 발생: ", error);
        throw error;
    }
};