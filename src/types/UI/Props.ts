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