import { useState } from 'react';

interface NewOrganizationForm {
  name: string;
  description: string;
  website: string;
}

interface NewLocationForm {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface NewSpecialtyForm {
  name: string;
  description: string;
}

export const useCreateJobDialogs = () => {
  const [showOrgDialog, setShowOrgDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showSpecialtyDialog, setShowSpecialtyDialog] = useState(false);
  
  const [newOrg, setNewOrg] = useState<NewOrganizationForm>({
    name: '',
    description: '',
    website: '',
  });
  
  const [newLocation, setNewLocation] = useState<NewLocationForm>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });

  const [newSpecialty, setNewSpecialty] = useState<NewSpecialtyForm>({
    name: '',
    description: '',
  });

  const resetOrgForm = () => {
    setNewOrg({ name: '', description: '', website: '' });
  };

  const resetLocationForm = () => {
    setNewLocation({
      name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    });
  };

  const resetSpecialtyForm = () => {
    setNewSpecialty({ name: '', description: '' });
  };

  const openOrgDialog = () => setShowOrgDialog(true);
  const closeOrgDialog = () => {
    setShowOrgDialog(false);
    resetOrgForm();
  };

  const openLocationDialog = () => setShowLocationDialog(true);
  const closeLocationDialog = () => {
    setShowLocationDialog(false);
    resetLocationForm();
  };

  const openSpecialtyDialog = () => setShowSpecialtyDialog(true);
  const closeSpecialtyDialog = () => {
    setShowSpecialtyDialog(false);
    resetSpecialtyForm();
  };

  return {
    // Organization dialog
    showOrgDialog,
    newOrg,
    setNewOrg,
    openOrgDialog,
    closeOrgDialog,
    resetOrgForm,
    
    // Location dialog
    showLocationDialog,
    newLocation,
    setNewLocation,
    openLocationDialog,
    closeLocationDialog,
    resetLocationForm,

    // Specialty dialog
    showSpecialtyDialog,
    newSpecialty,
    setNewSpecialty,
    openSpecialtyDialog,
    closeSpecialtyDialog,
    resetSpecialtyForm,
  };
};
