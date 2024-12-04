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

export interface PinProps {
    id: number;
    userId: number;
    title: string;
    content: string;
    latitude: number;
    longitude: number;
    createdAt: string;
}