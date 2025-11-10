import { useState } from "react";
import type { Flete } from "../types/Flete";

interface DeleteModalState {
    isOpen: boolean;
    flete: Flete | null;
    isDeleting: boolean;
}

export const useDeleteModal = () => {
    const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
        isOpen: false,
        flete: null,
        isDeleting: false
    });

    const openDeleteModal = (flete: Flete) => {
        setDeleteModal({
            isOpen: true,
            flete,
            isDeleting: false
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            flete: null,
            isDeleting: false
        });
    };

    const startDeleting = () => {
        setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    };

    const stopDeleting = () => {
        setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    };

    return {
        deleteModal,
        openDeleteModal,
        closeDeleteModal,
        startDeleting,
        stopDeleting
    };
};