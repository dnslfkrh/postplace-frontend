import React from 'react';
import { ConfirmModalProps } from '@/types/UI/Props';

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-gray-100 p-4 rounded shadow-lg">
                <p className="text-gray-800 text-center">{message}</p>
                <div className="flex justify-end mt-4">
                    <button onClick={onConfirm} className="mr-2 px-4 py-2 bg-gray-700 text-white rounded">확인</button>
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">취소</button>
                </div>
            </div>
        </div>
    );
}
