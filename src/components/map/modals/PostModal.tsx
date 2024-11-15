import { useState } from "react";
import { Position, PostModalProps } from "@/types/map/Props";

interface ExtendedPostModalProps extends PostModalProps {
    position: Position;
}

export const PostModal = ({ onClose, onSubmit, position }: ExtendedPostModalProps) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ 
            title, 
            content, 
            position
        });
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"  onClick={onClose}>
            <div className="fixed bg-black/40"/>
            <div className="relative bg-gray-200 p-6 rounded-lg shadow-lg w-11/12 max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 flex justify-center">게시물을 지도 위에 표시해 봐요</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 rounded w-full p-2 mb-4 bg-gray-300 text-gray-800 focus:outline-none focus:ring focus:ring-gray-500"
                    />
                    <textarea
                        placeholder="내용"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="border border-gray-300 rounded w-full p-2 mb-4 bg-gray-300 text-gray-800 resize-none focus:outline-none focus:ring focus:ring-gray-500"
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
