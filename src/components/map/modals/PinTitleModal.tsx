import React from 'react';
import { PinPropsInMap } from '@/types/map/Props';

interface PinTitleModalProps {
    pin: PinPropsInMap;
    onClose: () => void;
}

export const PinTitleModal: React.FC<PinTitleModalProps> = ({ pin, onClose }) => {
    return (
        <div className="absolute bg-white shadow-lg rounded-lg p-4 border border-gray-200 min-w-[200px]">
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-white border-b border-r border-gray-200"></div>
            
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-800">{pin.title}</h3>
                <button 
                    onClick={onClose} 
                    className="text-gray-500 hover:text-gray-700 ml-2"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};