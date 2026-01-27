'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Save, Send, Plus, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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
import { useJobForm } from '@/hooks/useJobForm';
import { useJobEditForm } from '@/hooks/useJobEditForm';
import { useEmployerRoleCheck } from '@/hooks/useEmployerRoleCheck';
import { JobType, JobStatus, Job, CreateJobDto, Organization } from '@/types';
import { NotAuthorizedUser } from '@/components/NotAuthorized';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { CreateResourceDialog } from '../components/CreateResourceDialog';
import { JobFormSkeleton } from '../components/JobFormSkeleton';

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
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);

    const { data: user } = useGetMe();
    const { isEmployer } = useEmployerRoleCheck(user);
    const { data: employerProfile } = useGetEmployerProfile(user);

    const { data: organizations = [] } = useGetOrganizations(employerProfile?.id);
    const { data: locations = [] } = useGetLocations();
    const { data: specialtiesData } = useGetSpecialties();
    const specialties = specialtiesData?.items ?? [];

    const { selectedSpecialties, setSelectedSpecialties } = useSpecialtySelection();

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

    const initializedRef = useRef(false);

    // Initialize selected specialties for edit mode
    useEffect(() => {
        if (mode === 'edit' && existingJob?.specialties && !initializedRef.current) {
            setSelectedSpecialties(existingJob.specialties);
            initializedRef.current = true;
        }
    }, [mode, existingJob, setSelectedSpecialties]);

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

    const handleNext = async () => {
        let fieldsToValidate: any[] = [];
        if (currentStep === 1) {
            fieldsToValidate = ['title', 'jobType', 'description'];
        } else if (currentStep === 2) {
            fieldsToValidate = ['salaryMin', 'salaryMax', 'requirements', 'responsibilities', 'benefits', 'closingDate', 'maxApplications'];
        } else if (currentStep === 3) {
            fieldsToValidate = ['organizationId', 'locationId', 'specialtyIds'];
        }

        const isValid = await form.trigger(fieldsToValidate);
        if (isValid) {
            if (currentStep < STEPS.length) {
                setCurrentStep(currentStep + 1);
            }
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

    if (!isFormReady || !user) {
        return <JobFormSkeleton />;
    }

    if (!user || !isEmployer) {
        return <NotAuthorizedUser userType={user?.role} />;
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
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
                                        {form.formState.errors.salaryMin && (
                                            <p className="text-sm text-destructive">{form.formState.errors.salaryMin.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="salaryMax">Maximum Salary</Label>
                                        <Input
                                            id="salaryMax"
                                            type="number"
                                            {...form.register('salaryMax', { valueAsNumber: true })}
                                            placeholder="100000"
                                        />
                                        {form.formState.errors.salaryMax && (
                                            <p className="text-sm text-destructive">{form.formState.errors.salaryMax.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="requirements">Requirements</Label>
                                    <Textarea
                                        id="requirements"
                                        {...form.register('requirements')}
                                        rows={4}
                                        placeholder={`List the qualifications, certifications, and experience required. Please add each item on a new line.

Example:
Bachelor's degree
5 years of experience`}
                                    />
                                    {form.formState.errors.requirements && (
                                        <p className="text-sm text-destructive">{form.formState.errors.requirements.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="responsibilities">Responsibilities</Label>
                                    <Textarea
                                        id="responsibilities"
                                        {...form.register('responsibilities')}
                                        rows={4}
                                        placeholder={`List the key responsibilities and duties. Please add each item on a new line.

Example:
Diagnose and treat patients
Collaborate with medical team`}
                                    />
                                    {form.formState.errors.responsibilities && (
                                        <p className="text-sm text-destructive">{form.formState.errors.responsibilities.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="benefits">Benefits</Label>
                                    <Textarea
                                        id="benefits"
                                        {...form.register('benefits')}
                                        rows={4}
                                        placeholder={`Describe the benefits package, perks, and other advantages. Please add each item on a new line.

Example:
Health insurance
401k matching`}
                                    />
                                    {form.formState.errors.benefits && (
                                        <p className="text-sm text-destructive">{form.formState.errors.benefits.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2 flex flex-col">
                                        <Label htmlFor="closingDate">Application Deadline</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !form.watch('closingDate') && "text-muted-foreground"
                                                    )}
                                                >
                                                    {form.watch('closingDate') ? (
                                                        format(new Date(form.watch('closingDate')), "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={form.watch('closingDate') ? new Date(form.watch('closingDate')) : undefined}
                                                    onSelect={(date) => {
                                                        form.setValue('closingDate', date ? format(date, 'yyyy-MM-dd') : '', { shouldValidate: true });
                                                    }}
                                                    disabled={(date) =>
                                                        date < new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {form.formState.errors.closingDate && (
                                            <p className="text-sm text-destructive">{form.formState.errors.closingDate.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="maxApplications">Max Applications</Label>
                                        <Input
                                            id="maxApplications"
                                            type="number"
                                            {...form.register('maxApplications')}
                                            placeholder="e.g., 50"
                                        />
                                        {form.formState.errors.maxApplications && (
                                            <p className="text-sm text-destructive">{form.formState.errors.maxApplications.message}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                                <Button variant="outline" onClick={handlePrevious} className="w-full sm:w-auto">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Previous
                                </Button>
                                <Button onClick={handleNext} className="w-full sm:w-auto">
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
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Select
                                            value={form.watch('organizationId')}
                                            onValueChange={(value) => form.setValue('organizationId', value, { shouldValidate: true })}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select organization" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {organizations?.map((org: Organization) => (
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
                                    {form.formState.errors.organizationId && (
                                        <p className="text-sm text-destructive">{form.formState.errors.organizationId.message}</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Location</CardTitle>
                                    <CardDescription>Select or create a location</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Select
                                            value={form.watch('locationId')}
                                            onValueChange={(value) => form.setValue('locationId', value, { shouldValidate: true })}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations?.map((loc: any) => (
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
                                    {form.formState.errors.locationId && (
                                        <p className="text-sm text-destructive">{form.formState.errors.locationId.message}</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Specialties</CardTitle>
                                    <CardDescription>Select or create specialties</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Select
                                            value={form.watch('specialtyIds')?.[0] || ''}
                                            onValueChange={(value) => {
                                                const selected = specialties.find((s: any) => s.id === value);
                                                setSelectedSpecialties(selected ? [selected] : []);
                                                form.setValue('specialtyIds', value ? [value] : [], { shouldValidate: true });
                                            }}
                                        >
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select specialty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {specialties?.map((spec: any) => (
                                                    <SelectItem key={spec.id} value={spec.id}>
                                                        {spec.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button type="button" variant="outline" onClick={openSpecialtyDialog}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            New
                                        </Button>
                                    </div>
                                    {form.formState.errors.specialtyIds && (
                                        <p className="text-sm text-destructive">{form.formState.errors.specialtyIds.message}</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
                                    <Button variant="outline" onClick={handlePrevious} className="w-full sm:w-auto">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Previous
                                    </Button>
                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleSaveDraft}
                                            disabled={createJobMutation.isPending || updateJobMutation.isPending}
                                            className="w-full sm:w-auto"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            Save as Draft
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handlePublish}
                                            disabled={createJobMutation.isPending || updateJobMutation.isPending}
                                            className="w-full sm:w-auto"
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
