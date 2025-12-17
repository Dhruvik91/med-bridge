import { useState } from 'react';

interface SpecialtyFormData {
    name: string;
    description: string;
}

export const useAddSpecialtyModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [specialtyFormData, setSpecialtyFormData] = useState<SpecialtyFormData>({
        name: '',
        description: '',
    });

    const openModal = () => setIsOpen(true);

    const closeModal = () => {
        setIsOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setSpecialtyFormData({
            name: '',
            description: '',
        });
    };

    return {
        isOpen,
        openModal,
        closeModal,
        specialtyFormData,
        setSpecialtyFormData,
        resetForm,
    };
};
