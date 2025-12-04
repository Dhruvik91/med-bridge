'use client';

import { useState } from 'react';
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
  ArrowRight,
  Save,
  Send,
  Plus,
  X,
  CheckCircle2,
  Circle,
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
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Essentials', description: 'Title, Type & Description' },
  { id: 2, title: 'Details', description: 'Salary, Requirements & Benefits' },
  { id: 3, title: 'Context', description: 'Organization, Location & Specialties' },
];

export default function CreateJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

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
    trigger,
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

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof JobFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['title', 'description', 'jobType'];
    } else if (currentStep === 2) {
      // Add any required fields for step 2 if needed, currently none are strictly required by schema except maybe salary if we wanted
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user || !isEmployer) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Post a New Job</h1>
        <p className="text-muted-foreground">
          Create a compelling job posting to attract the best medical professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-8 space-y-6">
          <form id="job-form" onSubmit={handleSubmit(handleFormSubmit)}>

            {/* Step 1: Essentials */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Job Essentials
                    </CardTitle>
                    <CardDescription>
                      Let's start with the core details of the position.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-base">Job Title <span className="text-destructive">*</span></Label>
                      <Input
                        id="title"
                        placeholder="e.g., Senior Cardiologist"
                        className="mt-2"
                        {...register('title', { required: 'Job title is required' })}
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="jobType" className="text-base">Job Type <span className="text-destructive">*</span></Label>
                      <Select
                        value={watch('jobType')}
                        onValueChange={(value) => setValue('jobType', value as JobType)}
                      >
                        <SelectTrigger className="mt-2">
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
                      <Label htmlFor="description" className="text-base">Job Description <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                        rows={8}
                        className="mt-2 resize-none"
                        {...register('description', { required: 'Job description is required' })}
                      />
                      {errors.description && (
                        <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Specific Details
                    </CardTitle>
                    <CardDescription>
                      Add more context about the compensation and requirements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="salaryMin" className="text-base">Minimum Salary</Label>
                        <div className="relative mt-2">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="salaryMin"
                            type="number"
                            placeholder="80,000"
                            className="pl-9"
                            {...register('salaryMin')}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="salaryMax" className="text-base">Maximum Salary</Label>
                        <div className="relative mt-2">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="salaryMax"
                            type="number"
                            placeholder="120,000"
                            className="pl-9"
                            {...register('salaryMax')}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="closingDate" className="text-base">Closing Date</Label>
                      <div className="relative mt-2">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="closingDate"
                          type="date"
                          className="pl-9"
                          {...register('closingDate')}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="requirements" className="text-base">Requirements</Label>
                      <Textarea
                        id="requirements"
                        placeholder="List the qualifications, skills, and experience needed (one per line recommended)..."
                        rows={6}
                        className="mt-2 resize-none"
                        {...register('requirements')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="benefits" className="text-base">Benefits & Perks</Label>
                      <Textarea
                        id="benefits"
                        placeholder="Describe compensation, benefits, perks, and other advantages..."
                        rows={6}
                        className="mt-2 resize-none"
                        {...register('benefits')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Context */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Organization & Location
                    </CardTitle>
                    <CardDescription>
                      Where is this job located and who is hiring?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Organization */}
                    <div className="space-y-3">
                      <Label htmlFor="organizationId" className="text-base">Organization</Label>
                      <div className="flex gap-3">
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
                          variant="outline"
                          onClick={openOrgDialog}
                          className="shrink-0"
                        >
                          <Plus className="h-4 w-4 mr-2" /> New
                        </Button>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                      <Label htmlFor="locationId" className="text-base">Location</Label>
                      <div className="flex gap-3">
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
                          variant="outline"
                          onClick={openLocationDialog}
                          className="shrink-0"
                        >
                          <Plus className="h-4 w-4 mr-2" /> New
                        </Button>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="space-y-3">
                      <Label className="text-base">Specialties</Label>
                      <div className="flex gap-3">
                        {specialties.filter((s) => !selectedSpecialties.find((sel) => sel.id === s.id)).length > 0 ? (
                          <Select onValueChange={handleAddSpecialty}>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Add a specialty" />
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
                          <div className="flex-1 flex items-center justify-center py-2 px-3 border border-dashed rounded-md bg-muted/50 text-sm text-muted-foreground">
                            {selectedSpecialties.length > 0
                              ? "All specialties selected"
                              : "No specialties available"}
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={openSpecialtyDialog}
                          className="shrink-0"
                        >
                          <Plus className="h-4 w-4 mr-2" /> New
                        </Button>
                      </div>

                      {selectedSpecialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 p-3 bg-muted/20 rounded-lg border">
                          {selectedSpecialties.map((specialty) => (
                            <Badge key={specialty.id} variant="secondary" className="pl-2 pr-1 py-1 text-sm">
                              {specialty.name}
                              <button
                                type="button"
                                onClick={() => handleRemoveSpecialty(specialty.id)}
                                className="ml-2 p-0.5 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={currentStep === 1 ? () => router.back() : handlePrevStep}
                className="text-muted-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>

              {currentStep < 3 && (
                <Button type="button" onClick={handleNextStep}>
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {STEPS.map((step) => (
                  <div key={step.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                          currentStep > step.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : currentStep === step.id
                              ? "border-primary text-primary"
                              : "border-muted-foreground/30 text-muted-foreground"
                        )}
                      >
                        {currentStep > step.id ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      {step.id !== STEPS.length && (
                        <div className={cn(
                          "h-full w-0.5 my-1",
                          currentStep > step.id ? "bg-primary" : "bg-muted-foreground/20"
                        )} />
                      )}
                    </div>
                    <div className={cn("pb-6", currentStep === step.id ? "opacity-100" : "opacity-60")}>
                      <p className="font-medium leading-none">{step.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="border-primary/20 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Actions</CardTitle>
                <CardDescription>Ready to post this job?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="submit"
                  form="job-form"
                  disabled={isSubmitting}
                  onClick={() => setValue('status', JobStatus.published)}
                  className="w-full"
                  size="lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Publish Job
                </Button>
                <Button
                  type="submit"
                  form="job-form"
                  variant="secondary"
                  disabled={isSubmitting}
                  onClick={() => setValue('status', JobStatus.draft)}
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
