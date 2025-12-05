'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Save, Send, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useGetOrganizations } from '@/hooks/get/useGetOrganizations';
import { useGetLocations } from '@/hooks/get/useGetLocations';
import { useGetSpecialties } from '@/hooks/get/useGetSpecialties';
import { useCreateJob } from '@/hooks/post/useCreateJob';
import { useUpdateJob } from '@/hooks/update/useUpdateJob';
import { useCreateOrganization } from '@/hooks/post/useCreateOrganization';
import { useCreateLocation } from '@/hooks/post/useCreateLocation';
import { useCreateSpecialty } from '@/hooks/post/useCreateSpecialty';
import { useSpecialtySelection } from '@/hooks/useSpecialtySelection';
import { useCreateJobDialogs } from '@/hooks/useCreateJobDialogs';
import { useJobForm, JobFormData } from '@/hooks/useJobForm';
import { useJobEditForm } from '@/hooks/useJobEditForm';
import { useEmployerRoleCheck } from '@/hooks/useEmployerRoleCheck';
import { JobType, JobStatus, Job, CreateJobDto } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { NotAuthorizedUser } from '@/components/NotAuthorized';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { CreateResourceDialog } from '../components/CreateResourceDialog';
import { SpecialtySelector } from '../components/SpecialtySelector';

const STEPS = [
    { id: 1, title: 'Essentials', description: 'Title, Type & Description' },
    { id: 2, title: 'Details', description: 'Salary, Requirements & Benefits' },
    { id: 3, title: 'Context', description: 'Organization, Location & Specialties' },
];

interface JobFormContainerProps {
    mode: 'create' | 'edit';
    existingJob?: Job;
}

export const JobFormContainer = ({ mode, existingJob }: JobFormContainerProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);

    const { data: user } = useGetMe();
    const { isEmployer } = useEmployerRoleCheck(user);
    const { data: employerProfile } = useGetEmployerProfile(user);

    const { data: organizations = [] } = useGetOrganizations(employerProfile?.id);
    const { data: locations = [] } = useGetLocations();
    const { data: specialties = [] } = useGetSpecialties();

    const { selectedSpecialties, addSpecialty, removeSpecialty, setSelectedSpecialties } = useSpecialtySelection();

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

    const createJobMutation = useCreateJob();
    const updateJobMutation = useUpdateJob(existingJob?.id || '');
    const createOrgMutation = useCreateOrganization();
    const createLocationMutation = useCreateLocation();
    const createSpecialtyMutation = useCreateSpecialty();

    // Use appropriate form hook based on mode
    const createFormHook = useJobForm({
        employerProfileId: employerProfile?.id || '',
        selectedSpecialties,
        onSubmit: (data: CreateJobDto) => {
            createJobMutation.mutate(data);
        },
    });

    const editFormHook = useJobEditForm({
        job: existingJob,
        employerProfileId: employerProfile?.id || '',
        selectedSpecialties,
        onSubmit: (data) => {
            updateJobMutation.mutate(data);
        },
    });

    const { form, handleFormSubmit } = mode === 'create' ? createFormHook : editFormHook;
    const isFormReady = mode === 'edit' ? editFormHook.isFormReady : true;

    // Initialize selected specialties for edit mode
    if (mode === 'edit' && existingJob?.specialties && selectedSpecialties.length === 0) {
        setSelectedSpecialties(existingJob.specialties);
    }

    const handleCreateOrganization = useCallback(() => {
        if (!newOrg.name) {
            toast({ title: 'Error', description: 'Organization name is required', variant: 'destructive' });
            return;
        }
        if (!employerProfile?.id) {
            toast({ title: 'Error', description: 'Employer profile not found', variant: 'destructive' });
            return;
        }
        createOrgMutation.mutate({
            employerProfileId: employerProfile.id,
            name: newOrg.name,
            description: newOrg.description || undefined,
            website: newOrg.website || undefined,
        }, {
            onSuccess: () => {
                closeOrgDialog();
                resetOrgForm();
            },
        });
    }, [newOrg, employerProfile, createOrgMutation, closeOrgDialog, resetOrgForm, toast]);

    const handleCreateLocation = useCallback(() => {
        if (!newLocation.city || !newLocation.country) {
            toast({ title: 'Error', description: 'City and country are required', variant: 'destructive' });
            return;
        }
        createLocationMutation.mutate(newLocation, {
            onSuccess: () => {
                closeLocationDialog();
                resetLocationForm();
            },
        });
    }, [newLocation, createLocationMutation, closeLocationDialog, resetLocationForm, toast]);

    const handleCreateSpecialty = useCallback(() => {
        if (!newSpecialty.name) {
            toast({ title: 'Error', description: 'Specialty name is required', variant: 'destructive' });
            return;
        }
        createSpecialtyMutation.mutate(newSpecialty, {
            onSuccess: () => {
                closeSpecialtyDialog();
                resetSpecialtyForm();
            },
        });
    }, [newSpecialty, createSpecialtyMutation, closeSpecialtyDialog, resetSpecialtyForm, toast]);

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSaveDraft = () => {
        form.setValue('status', JobStatus.draft);
        form.handleSubmit(handleFormSubmit)();
    };

    const handlePublish = () => {
        form.setValue('status', JobStatus.published);
        form.handleSubmit(handleFormSubmit)();
    };

    if (!user || !isEmployer) {
        return <NotAuthorizedUser userType="employer" />;
    }

    if (!isFormReady) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button asChild variant="ghost" className="mb-6">
                <Link href={FRONTEND_ROUTES.JOBS.MANAGE}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Manage Jobs
                </Link>
            </Button>

            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        {mode === 'create' ? 'Post a New Job' : 'Edit Job Posting'}
                    </h1>
                    <p className="text-muted-foreground">
                        {mode === 'create'
                            ? 'Fill in the details to create a new job posting'
                            : 'Update the job posting details'}
                    </p>
                </div>

                <ProgressIndicator
                    currentStep={currentStep}
                    totalSteps={STEPS.length}
                    stepLabels={STEPS.map((s) => s.title)}
                />

                <form onSubmit={(e) => e.preventDefault()}>
                    {/* Step 1: Essentials */}
                    {currentStep === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Essentials</CardTitle>
                                <CardDescription>Provide the basic information about the job</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Job Title *</Label>
                                    <Input
                                        id="title"
                                        {...form.register('title')}
                                        placeholder="e.g., Senior Cardiologist"
                                    />
                                    {form.formState.errors.title && (
                                        <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jobType">Job Type *</Label>
                                    <Select
                                        value={form.watch('jobType')}
                                        onValueChange={(value) => form.setValue('jobType', value as JobType)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select job type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={JobType.full_time}>Full Time</SelectItem>
                                            <SelectItem value={JobType.part_time}>Part Time</SelectItem>
                                            <SelectItem value={JobType.contract}>Contract</SelectItem>
                                            <SelectItem value={JobType.temporary}>Temporary</SelectItem>
                                            <SelectItem value={JobType.remote}>Remote</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Job Description *</Label>
                                    <Textarea
                                        id="description"
                                        {...form.register('description')}
                                        rows={6}
                                        placeholder="Describe the job role, responsibilities, and what makes this position unique..."
                                    />
                                    {form.formState.errors.description && (
                                        <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button onClick={handleNext}>
                                    Next Step
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Step 2: Details */}
                    {currentStep === 2 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Details</CardTitle>
                                <CardDescription>Provide salary, requirements, and benefits</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="salaryMin">Minimum Salary</Label>
                                        <Input
                                            id="salaryMin"
                                            type="number"
                                            {...form.register('salaryMin', { valueAsNumber: true })}
                                            placeholder="50000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="salaryMax">Maximum Salary</Label>
                                        <Input
                                            id="salaryMax"
                                            type="number"
                                            {...form.register('salaryMax', { valueAsNumber: true })}
                                            placeholder="100000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="requirements">Requirements</Label>
                                    <Textarea
                                        id="requirements"
                                        {...form.register('requirements')}
                                        rows={4}
                                        placeholder="List the qualifications, certifications, and experience required..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="benefits">Benefits</Label>
                                    <Textarea
                                        id="benefits"
                                        {...form.register('benefits')}
                                        rows={4}
                                        placeholder="Describe the benefits package, perks, and other advantages..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="closingDate">Application Deadline</Label>
                                    <Input
                                        id="closingDate"
                                        type="date"
                                        {...form.register('closingDate')}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline" onClick={handlePrevious}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Previous
                                </Button>
                                <Button onClick={handleNext}>
                                    Next Step
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Step 3: Context */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Organization</CardTitle>
                                    <CardDescription>Select or create an organization</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Select
                                            value={form.watch('organizationId')}
                                            onValueChange={(value) => form.setValue('organizationId', value)}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select organization" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {organizations.map((org: any) => (
                                                    <SelectItem key={org.id} value={org.id}>
                                                        {org.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button type="button" variant="outline" onClick={openOrgDialog}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            New
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Location</CardTitle>
                                    <CardDescription>Select or create a location</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Select
                                            value={form.watch('locationId')}
                                            onValueChange={(value) => form.setValue('locationId', value)}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((loc: any) => (
                                                    <SelectItem key={loc.id} value={loc.id}>
                                                        {loc.city}, {loc.country}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button type="button" variant="outline" onClick={openLocationDialog}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            New
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <SpecialtySelector
                                availableSpecialties={specialties}
                                selectedSpecialties={selectedSpecialties}
                                onAddSpecialty={(specialtyId: string) => {
                                    const specialty = specialties.find(s => s.id === specialtyId);
                                    if (specialty) addSpecialty(specialty);
                                }}
                                onRemoveSpecialty={removeSpecialty}
                                onCreateNew={openSpecialtyDialog}
                            />

                            <Card>
                                <CardFooter className="flex justify-between pt-6">
                                    <Button variant="outline" onClick={handlePrevious}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Previous
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleSaveDraft}
                                            disabled={createJobMutation.isPending || updateJobMutation.isPending}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            Save as Draft
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handlePublish}
                                            disabled={createJobMutation.isPending || updateJobMutation.isPending}
                                        >
                                            <Send className="mr-2 h-4 w-4" />
                                            {mode === 'create' ? 'Publish Job' : 'Update & Publish'}
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    )}
                </form>
            </div>

            {/* Dialogs */}
            <CreateResourceDialog
                isOpen={showOrgDialog}
                onClose={closeOrgDialog}
                resourceType="organization"
                formData={newOrg}
                onFormDataChange={setNewOrg}
                onCreate={handleCreateOrganization}
                isCreating={createOrgMutation.isPending}
            />

            <CreateResourceDialog
                isOpen={showLocationDialog}
                onClose={closeLocationDialog}
                resourceType="location"
                formData={newLocation}
                onFormDataChange={setNewLocation}
                onCreate={handleCreateLocation}
                isCreating={createLocationMutation.isPending}
            />

            <CreateResourceDialog
                isOpen={showSpecialtyDialog}
                onClose={closeSpecialtyDialog}
                resourceType="specialty"
                formData={newSpecialty}
                onFormDataChange={setNewSpecialty}
                onCreate={handleCreateSpecialty}
                isCreating={createSpecialtyMutation.isPending}
            />
        </div>
    );
};
