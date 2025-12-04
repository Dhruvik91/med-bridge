'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  FileText,
  ArrowLeft,
  Save,
  Send,
  Plus,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useGetOrganizations } from '@/hooks/get/useGetOrganizations';
import { useGetLocations } from '@/hooks/get/useGetLocations';
import { useGetSpecialties } from '@/hooks/get/useGetSpecialties';
import { useCreateJob } from '@/hooks/post/useCreateJob';
import { useCreateOrganization } from '@/hooks/post/useCreateOrganization';
import { useCreateLocation } from '@/hooks/post/useCreateLocation';
import { useCreateSpecialty } from '@/hooks/post/useCreateSpecialty';
import { useSpecialtySelection } from '@/hooks/useSpecialtySelection';
import { useCreateJobDialogs } from '@/hooks/useCreateJobDialogs';
import { useJobForm, JobFormData } from '@/hooks/useJobForm';
import { useEmployerRoleCheck } from '@/hooks/useEmployerRoleCheck';
import {
  JobType,
  JobStatus,
  UserRole,
} from '@/types';

export default function CreateJobPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Get current user and check role
  const { data: user } = useGetMe();
  const { isEmployer } = useEmployerRoleCheck(user);

  // Get employer profile
  const { data: employerProfile } = useGetEmployerProfile(user);

  // Get all data needed for form
  const { data: organizations = [] } = useGetOrganizations(employerProfile?.id);
  const { data: locations = [] } = useGetLocations();
  const { data: specialties = [] } = useGetSpecialties();

  // Specialty selection hook
  const { selectedSpecialties, addSpecialty, removeSpecialty } = useSpecialtySelection();

  // Dialog management hook
  const {
    showOrgDialog,
    newOrg,
    setNewOrg,
    openOrgDialog,
    closeOrgDialog,
    resetOrgForm,
    showLocationDialog,
    newLocation,
    setNewLocation,
    openLocationDialog,
    closeLocationDialog,
    resetLocationForm,
    showSpecialtyDialog,
    newSpecialty,
    setNewSpecialty,
    openSpecialtyDialog,
    closeSpecialtyDialog,
    resetSpecialtyForm,
  } = useCreateJobDialogs();

  // Create mutations
  const createJobMutation = useCreateJob();

  const createOrgMutation = useCreateOrganization({
    onSuccess: (organizationId) => {
      form.setValue('organizationId', organizationId);
    },
    onDialogClose: closeOrgDialog,
  });

  const createLocationMutation = useCreateLocation({
    onSuccess: (locationId) => {
      form.setValue('locationId', locationId);
    },
    onDialogClose: closeLocationDialog,
  });

  const createSpecialtyMutation = useCreateSpecialty({
    onSuccess: (specialty) => {
      // Add the created specialty to selected specialties
      addSpecialty(specialty);
    },
    onDialogClose: closeSpecialtyDialog,
  });

  // Form hook
  const { form, handleFormSubmit } = useJobForm({
    employerProfileId: employerProfile?.id,
    selectedSpecialties,
    onSubmit: (jobData) => createJobMutation.mutate(jobData),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  // Handlers for specialty selection
  const handleAddSpecialty = (specialtyId: string) => {
    const specialty = specialties.find((s) => s.id === specialtyId);
    if (specialty) {
      addSpecialty(specialty);
    }
  };

  const handleRemoveSpecialty = (specialtyId: string) => {
    removeSpecialty(specialtyId);
  };

  // Handlers for creating organization and location
  const handleCreateOrganization = () => {
    if (!employerProfile?.id || !newOrg.name) {
      toast({
        title: 'Error',
        description: 'Please provide an organization name.',
        variant: 'destructive',
      });
      return;
    }

    createOrgMutation.mutate({
      employerProfileId: employerProfile.id,
      name: newOrg.name,
      description: newOrg.description || undefined,
      website: newOrg.website || undefined,
    });
  };

  const handleCreateLocation = () => {
    if (!newLocation.name || !newLocation.city || !newLocation.country) {
      toast({
        title: 'Error',
        description: 'Please provide location name, city, and country.',
        variant: 'destructive',
      });
      return;
    }

    createLocationMutation.mutate({
      name: newLocation.name,
      address: newLocation.address || undefined,
      city: newLocation.city,
      state: newLocation.state || undefined,
      country: newLocation.country,
      postalCode: newLocation.postalCode || undefined,
    });
  };

  const handleCreateSpecialty = () => {
    if (!newSpecialty.name) {
      toast({
        title: 'Error',
        description: 'Please provide a specialty name.',
        variant: 'destructive',
      });
      return;
    }

    createSpecialtyMutation.mutate({
      name: newSpecialty.name,
      description: newSpecialty.description || undefined,
    });
  };

  if (!user || !isEmployer) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Post a New Job</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Create a job posting to attract qualified medical professionals
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Basic Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Briefcase className="h-5 w-5 flex-shrink-0" />
              Basic Information
            </CardTitle>
            <CardDescription className="text-sm">
              Provide the essential details about the job position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., General Practitioner"
                {...register('title', { required: 'Job title is required' })}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                rows={6}
                {...register('description', { required: 'Job description is required' })}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List the qualifications, skills, and experience needed..."
                rows={4}
                {...register('requirements')}
              />
            </div>

            <div>
              <Label htmlFor="benefits">Benefits</Label>
              <Textarea
                id="benefits"
                placeholder="Describe compensation, benefits, perks, and other advantages..."
                rows={4}
                {...register('benefits')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText className="h-5 w-5 flex-shrink-0" />
              Job Details
            </CardTitle>
            <CardDescription className="text-sm">
              Specify the job type, salary, and other details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobType">Job Type *</Label>
                <Select
                  value={watch('jobType')}
                  onValueChange={(value) => setValue('jobType', value as JobType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={JobType.full_time}>Full Time</SelectItem>
                    <SelectItem value={JobType.part_time}>Part Time</SelectItem>
                    <SelectItem value={JobType.contract}>Contract</SelectItem>
                    <SelectItem value={JobType.temporary}>Temporary</SelectItem>
                    <SelectItem value={JobType.internship}>Internship</SelectItem>
                    <SelectItem value={JobType.remote}>Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) => setValue('status', value as JobStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={JobStatus.draft}>Draft</SelectItem>
                    <SelectItem value={JobStatus.published}>Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaryMin">
                  <DollarSign className="inline h-4 w-4" /> Minimum Salary
                </Label>
                <Input
                  id="salaryMin"
                  type="number"
                  placeholder="e.g., 80000"
                  {...register('salaryMin')}
                />
              </div>

              <div>
                <Label htmlFor="salaryMax">
                  <DollarSign className="inline h-4 w-4" /> Maximum Salary
                </Label>
                <Input
                  id="salaryMax"
                  type="number"
                  placeholder="e.g., 120000"
                  {...register('salaryMax')}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="closingDate">
                <Calendar className="inline h-4 w-4" /> Closing Date
              </Label>
              <Input
                id="closingDate"
                type="date"
                {...register('closingDate')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Organization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Building2 className="h-5 w-5 flex-shrink-0" />
              Organization
            </CardTitle>
            <CardDescription className="text-sm">
              Select an organization or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="organizationId" className="text-sm sm:text-base">Organization (Optional)</Label>
              <div className="flex gap-2">
                <Select
                  value={watch('organizationId') || 'none'}
                  onValueChange={(value) => setValue('organizationId', value === 'none' ? '' : value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={openOrgDialog}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <MapPin className="h-5 w-5 flex-shrink-0" />
              Location
            </CardTitle>
            <CardDescription className="text-sm">
              Select a location or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="locationId" className="text-sm sm:text-base">Location (Optional)</Label>
              <div className="flex gap-2">
                <Select
                  value={watch('locationId') || 'none'}
                  onValueChange={(value) => setValue('locationId', value === 'none' ? '' : value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name} - {loc.city}, {loc.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={openLocationDialog}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Specialties</CardTitle>
            <CardDescription className="text-sm">
              Add medical specialties relevant to this position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="specialty">Add Specialty</Label>
              <div className="flex gap-2">
                {specialties.filter((s) => !selectedSpecialties.find((sel) => sel.id === s.id)).length > 0 ? (
                  <Select onValueChange={handleAddSpecialty}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a specialty to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties
                        .filter((s) => !selectedSpecialties.find((sel) => sel.id === s.id))
                        .map((specialty) => (
                          <SelectItem key={specialty.id} value={specialty.id}>
                            {specialty.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex-1 flex items-center justify-center py-3 px-4 border border-dashed border-muted-foreground/25 rounded-md bg-muted/10">
                    <p className="text-sm text-muted-foreground">
                      {selectedSpecialties.length > 0
                        ? "All available specialties have been selected"
                        : "No specialties available"}
                    </p>
                  </div>
                )}
                <Button
                  type="button"
                  onClick={openSpecialtyDialog}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {selectedSpecialties.length > 0 && (
              <div>
                <Label>Selected Specialties</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSpecialties.map((specialty) => (
                    <Badge key={specialty.id} variant="secondary" className="gap-1">
                      {specialty.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(specialty.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                type="submit"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setValue('status', JobStatus.draft)}
                className="w-full sm:w-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline sm:inline">Save as Draft</span>
                <span className="xs:hidden sm:hidden">Draft</span>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() => setValue('status', JobStatus.published)}
                className="w-full sm:w-auto"
              >
                <Send className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline sm:inline">Publish Job</span>
                <span className="xs:hidden sm:hidden">Publish</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>

      {/* Create Organization Dialog */}
      <Dialog open={showOrgDialog} onOpenChange={closeOrgDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Add a new organization to your profile
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="org-name">Organization Name *</Label>
              <Input
                id="org-name"
                placeholder="e.g., City General Hospital"
                value={newOrg.name}
                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="org-description">Description</Label>
              <Textarea
                id="org-description"
                placeholder="Brief description of the organization..."
                value={newOrg.description}
                onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="org-website">Website</Label>
              <Input
                id="org-website"
                placeholder="https://example.com"
                value={newOrg.website}
                onChange={(e) => setNewOrg({ ...newOrg, website: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeOrgDialog}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrganization} disabled={createOrgMutation.isPending}>
              Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Location Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={closeLocationDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Location</DialogTitle>
            <DialogDescription>
              Add a new location for job postings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="loc-name">Location Name *</Label>
              <Input
                id="loc-name"
                placeholder="e.g., Downtown Medical Center"
                value={newLocation.name}
                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="loc-address">Address</Label>
              <Input
                id="loc-address"
                placeholder="Street address"
                value={newLocation.address}
                onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loc-city">City *</Label>
                <Input
                  id="loc-city"
                  placeholder="City"
                  value={newLocation.city}
                  onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="loc-state">State/Province</Label>
                <Input
                  id="loc-state"
                  placeholder="State"
                  value={newLocation.state}
                  onChange={(e) => setNewLocation({ ...newLocation, state: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loc-country">Country *</Label>
                <Input
                  id="loc-country"
                  placeholder="Country"
                  value={newLocation.country}
                  onChange={(e) => setNewLocation({ ...newLocation, country: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="loc-postal">Postal Code</Label>
                <Input
                  id="loc-postal"
                  placeholder="Postal code"
                  value={newLocation.postalCode}
                  onChange={(e) => setNewLocation({ ...newLocation, postalCode: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeLocationDialog}>
              Cancel
            </Button>
            <Button onClick={handleCreateLocation} disabled={createLocationMutation.isPending}>
              Create Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Specialty Dialog */}
      <Dialog open={showSpecialtyDialog} onOpenChange={closeSpecialtyDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Specialty</DialogTitle>
            <DialogDescription>
              Add a new medical specialty to the list
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="spec-name">Specialty Name *</Label>
              <Input
                id="spec-name"
                placeholder="e.g., Cardiology"
                value={newSpecialty.name}
                onChange={(e) => setNewSpecialty({ ...newSpecialty, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="spec-description">Description</Label>
              <Textarea
                id="spec-description"
                placeholder="Brief description of the specialty..."
                value={newSpecialty.description}
                onChange={(e) => setNewSpecialty({ ...newSpecialty, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeSpecialtyDialog}>
              Cancel
            </Button>
            <Button onClick={handleCreateSpecialty} disabled={createSpecialtyMutation.isPending}>
              Create Specialty
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
