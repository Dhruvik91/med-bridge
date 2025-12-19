import { useState } from 'react';
import { Qualification } from '@/types';

export const useQualificationSelection = () => {
    const [selectedQualifications, setSelectedQualifications] = useState<Qualification[]>([]);

    const addQualification = (qualification: Qualification) => {
        if (!selectedQualifications.find((q) => q.id === qualification.id)) {
            setSelectedQualifications([...selectedQualifications, qualification]);
        }
    };

    const removeQualification = (qualificationId: string) => {
        setSelectedQualifications(selectedQualifications.filter((q) => q.id !== qualificationId));
    };

    const clearQualifications = () => {
        setSelectedQualifications([]);
    };

    return {
        selectedQualifications,
        setSelectedQualifications,
        addQualification,
        removeQualification,
        clearQualifications,
    };
};
