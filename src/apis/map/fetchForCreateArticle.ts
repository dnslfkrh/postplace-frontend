import { baseFetch } from "@/apis/baseFetch";
import { NewArticleProps } from "@/types/map/Props"

export const fetchForCreateArticle = async (articleData: NewArticleProps) => {
    try {
        const response = await baseFetch("/map/post/article", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(articleData)
        });

        if (!response.ok) {
            throw new Error("게시글 생성 실패");
        }

        return await response.json();
    } catch (error) {
        console.error("오류 발생: ", error);
        throw error;
    }
};