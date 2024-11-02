export interface MapProps {
    center: { lat: number; lng: number };
    zoom: number;
}

export interface CoordinateProps {
    lat: number;
    lng: number;
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
    }) => void;
}

export interface NewArticleProps {
    title: string;
    content: string;
    position: { latitude: number; longitude: number};
}