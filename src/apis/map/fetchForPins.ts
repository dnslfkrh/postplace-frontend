import { baseFetch } from "../baseFetch";

export const fetchForPins = async () => {
    try {
        console.log("요청 시작");
        const response = await baseFetch("/map/get/pins", {
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
        console.log(data);
        return data;

    } catch (error) {
        console.error("오류 발생: ", error);
        throw error;
    }
};