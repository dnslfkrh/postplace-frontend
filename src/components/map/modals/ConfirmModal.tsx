import React from 'react';
import { ConfirmModalProps } from '@/types/map/Props';

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 z-20" onClick={onCancel}>
        <div className="bg-gray-100 p-4 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
            <p className="text-xl text-gray-800 text-center">{message}</p>
            <div className="flex justify-center mt-4">
                <button onClick={(e) => { e.stopPropagation(); onConfirm(); }} className="px-6 py-2 bg-gray-700 text-white rounded">확인</button>
            </div>
        </div>
    </div>
);
