import { useState } from 'react';
import { Specialty } from '@/types';

export const useSpecialtySelection = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<Specialty[]>([]);

  const addSpecialty = (specialty: Specialty) => {
    if (!selectedSpecialties.find((s) => s.id === specialty.id)) {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  const removeSpecialty = (specialtyId: string) => {
    setSelectedSpecialties(selectedSpecialties.filter((s) => s.id !== specialtyId));
  };

  const clearSpecialties = () => {
    setSelectedSpecialties([]);
  };

  return {
    selectedSpecialties,
    setSelectedSpecialties,
    addSpecialty,
    removeSpecialty,
    clearSpecialties,
  };
};
