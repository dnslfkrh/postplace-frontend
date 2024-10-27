import React from 'react';
import { ConfirmModalProps } from '@/types/UI/Props';

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {

    return (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40" onClick={onCancel}>
            <div className="bg-gray-100 p-4 rounded shadow-lg">
                <p className="text-xl text-gray-800 text-center">{message}</p>
                <div className="flex justify-center mt-4">
                    <button onClick={onConfirm} className="px-6 py-2 bg-gray-700 text-white rounded">확인</button>
                </div>
            </div>
        </div>
    );
}
