export interface MapProps {
    center: { lat: number; lng: number };
    zoom: number;
}

export interface Position {
    latitude: number;
    longitude: number;
}

export interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export interface PostModalProps {
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        content: string;
        position: { latitude: number; longitude: number };
    }) => void;
}

export interface NewArticleProps {
    title: string;
    content: string;
    position: { latitude: number; longitude: number};
}

export interface PinPropsInMap {
    id: number;
    title: string;
    latitude: number;
    longitude: number;
}

export interface SinglePinInfoProps {
    userId: number;
    title: string;
    content: string;
    createdAt: string;
    isUpdated: boolean;
    updatedAt: string; // isUpdated가 true일 때만 값이 존재 (아니면 null)
};