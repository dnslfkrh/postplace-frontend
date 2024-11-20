import { Position, PostModalProps } from "@/types/map/Props";
import { useEffect, useState } from "react";

interface CurrentCenterPostModalProps extends PostModalProps {
    mapInstance: google.maps.Map | null;
}

export const CurrentCenterPostModal = ({ onClose, onSubmit, mapInstance }: CurrentCenterPostModalProps) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [miniMapInstance, setMiniMapInstance] = useState<google.maps.Map | null>(null);
    const [centerMarker, setCenterMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);

    useEffect(() => {
        if (!mapInstance) {
            return;
        }

        const miniMap = new google.maps.Map(document.getElementById("mini-map") as HTMLElement, {
            center: mapInstance.getCenter()?.toJSON(),
            zoom: mapInstance.getZoom(),
            disableDefaultUI: true,
            zoomControl: false,
            streetViewControl: false,
            clickableIcons: false,
            draggable: false,
            mapId: process.env.NEXT_PUBLIC_MAP_ID,
        });
        setMiniMapInstance(miniMap);

        if (mapInstance.getCenter()) {
            const marker = new google.maps.marker.AdvancedMarkerElement({
                position: mapInstance.getCenter()?.toJSON(),
                map: miniMap,
            });
            setCenterMarker(marker);
        }

        return () => {
            if (centerMarker) {
                centerMarker.map = null;
            }
        }
    }, [mapInstance]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!mapInstance) {
            return;
        }

        const center = mapInstance.getCenter();
        if (!center) {
            return;
        }

        const position: Position = {
            latitude: center.lat(),
            longitude: center.lng(),
        };

        onSubmit({
            title,
            content,
            position
        });

        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="fixed inset-0 bg-black/40" />
            <div
                className="relative bg-gray-200 p-6 rounded-lg shadow-lg w-11/12 max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4 text-gray-900 flex justify-center">
                    현재 화면에 게시물 추가하기
                </h2>
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
                    <div
                        id="mini-map"
                        className="w-full h-48 mb-4 rounded-lg overflow-hidden"
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
}