import { baseFetch } from "@/apis/baseFetch";
import { NewArticleProps } from "@/types/map/Props"

export const fetchForCreateArticle = async (articleData: NewArticleProps) => {
    try {
        console.log("요청 전송 시작: ", articleData);
        const response = await baseFetch("/map/post/article", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(articleData)
        });

        if (!response.ok) {
            throw new Error("게시글 생성 실패");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("오류 발생: ", error);
        throw error;
    }
}