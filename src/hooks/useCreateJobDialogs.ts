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

export const useCreateJobDialogs = () => {
  const [showOrgDialog, setShowOrgDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  
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
  };
};
