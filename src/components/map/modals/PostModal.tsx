import { PostModalProps } from "@/types/UI/Props";

export const PostModal = ({ onClose }: PostModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-gray-200 p-6 rounded-lg shadow-lg w-11/12 max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 flex justify-center">게시물을 지도 위에 표시해 봐요</h2>
                <form>
                    <input
                        type="text"
                        placeholder="제목"
                        className="border border-gray-300 rounded w-full p-2 mb-4 bg-gray-300 text-gray-800 focus:outline-none focus:ring focus:ring-gray-500" // 클릭 시 테두리 강조
                    />
                    <textarea
                        placeholder="내용"
                        className="border border-gray-300 rounded w-full p-2 mb-4 bg-gray-300 text-gray-800 resize-none focus:outline-none focus:ring focus:ring-gray-500" // 클릭 시 테두리 강조
                        rows={6}
                    />
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-gray-700 text-white rounded px-6 py-2"
                        >
                            등록
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
