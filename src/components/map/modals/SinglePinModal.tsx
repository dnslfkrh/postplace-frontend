import React, { useState, useEffect } from 'react';
import { fetchForSinglePin } from '@/apis/map/fetchForSinglePin';

interface SinglePinInfoProps {
    userName: string;
    title: string;
    content: string;
    createdAt: string;
    isUpdated: boolean;
    updatedAt: string | null;
}

interface SinglePinModalProps {
    pinId: number;
    onClose: () => void;
}

export const SinglePinModal: React.FC<SinglePinModalProps> = ({ pinId, onClose }) => {
    const [pinData, setPinData] = useState<SinglePinInfoProps | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPinData = async () => {
            try {
                setIsLoading(true);
                const data = await fetchForSinglePin(pinId);
                setPinData(data);
            } catch (err) {
                setError('게시물을 불러오는 중 오류가 발생했습니다.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadPinData();
    }, [pinId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                    <p className="text-gray-700">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !pinData) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
                <div className="bg-white p-6 rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <p className="text-red-500">{error || '데이터를 불러올 수 없습니다.'}</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        닫기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white w-11/12 max-w-2xl rounded-lg shadow-xl relative" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {pinData.title}
                    </h2>

                    <div className="text-sm text-gray-600 mb-4 flex justify-between">
                        <span>작성: {pinData.userName}</span>
                        <span>
                            {formatDate(pinData.createdAt)}
                            {pinData.isUpdated && (
                                <span className="ml-2 text-xs text-gray-500">
                                    (수정됨: {formatDate(pinData.updatedAt || '')})
                                </span>
                            )}
                        </span>
                    </div>

                    <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
                        {pinData.content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePinModal;
