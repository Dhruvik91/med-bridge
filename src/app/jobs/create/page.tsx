'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { jobService } from '@/services/job.service';
import { authService } from '@/services/auth.service';
import { employerProfileService } from '@/services/employer-profile.service';
import { organizationService } from '@/services/organization.service';
import { locationService } from '@/services/location.service';
import { specialtyService } from '@/services/specialty.service';
import { useToast } from '@/hooks/use-toast';
import { 
  JobType, 
  JobStatus, 
  UserRole,
  CreateJobDto,
  Organization,
  Location,
  Specialty,
  CreateOrganizationDto,
  CreateLocationDto,
} from '@/types';

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  salaryMin: string;
  salaryMax: string;
  jobType: JobType;
  status: JobStatus;
  closingDate: string;
  organizationId: string;
  locationId: string;
  specialtyIds: string[];
}

export default function CreateJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedSpecialties, setSelectedSpecialties] = useState<Specialty[]>([]);
  const [showOrgDialog, setShowOrgDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', description: '', website: '' });
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({
    defaultValues: {
      status: JobStatus.draft,
      jobType: JobType.full_time,
      specialtyIds: [],
    },
  });

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getMe,
  });

  // Get employer profile
  const { data: employerProfile } = useQuery({
    queryKey: ['employerProfile', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not found');
      return employerProfileService.findByUser(user.id);
    },
    enabled: !!user?.id && user?.role === UserRole.employer,
  });

  // Get organizations
  const { data: organizations = [] } = useQuery({
    queryKey: ['organizations', employerProfile?.id],
    queryFn: () => {
      if (!employerProfile?.id) throw new Error('Employer profile not found');
      return organizationService.findByEmployer(employerProfile.id);
    },
    enabled: !!employerProfile?.id,
  });

  // Get locations
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.findAll(),
  });

  // Get specialties
  const { data: specialties = [] } = useQuery({
    queryKey: ['specialties'],
    queryFn: () => specialtyService.findAll(),
  });

  // Create organization mutation
  const createOrgMutation = useMutation({
    mutationFn: (data: CreateOrganizationDto) => organizationService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setValue('organizationId', data.id);
      setShowOrgDialog(false);
      setNewOrg({ name: '', description: '', website: '' });
      toast({
        title: 'Organization created',
        description: 'Your organization has been created successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create organization.',
        variant: 'destructive',
      });
    },
  });

  // Create location mutation
  const createLocationMutation = useMutation({
    mutationFn: (data: CreateLocationDto) => locationService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setValue('locationId', data.id);
      setShowLocationDialog(false);
      setNewLocation({
        name: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      });
      toast({
        title: 'Location created',
        description: 'Your location has been created successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create location.',
        variant: 'destructive',
      });
    },
  });

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: (data: CreateJobDto) => jobService.create(data),
    onSuccess: () => {
      toast({
        title: 'Job created',
        description: 'Your job posting has been created successfully.',
      });
      router.push('/jobs/manage');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create job posting.',
        variant: 'destructive',
      });
    },
  });

  // Check if user is employer
  useEffect(() => {
    if (user && user.role !== UserRole.employer) {
      router.push('/jobs');
    }
  }, [user, router]);

  const onSubmit = (data: JobFormData) => {
    if (!employerProfile?.id) {
      toast({
        title: 'Error',
        description: 'Employer profile not found.',
        variant: 'destructive',
      });
      return;
    }

    // Convert textarea strings to arrays by splitting on newlines
    const requirementsArray = data.requirements
      ? data.requirements.split('\n').filter((line) => line.trim())
      : undefined;
    const perksArray = data.benefits
      ? data.benefits.split('\n').filter((line) => line.trim())
      : undefined;

    const jobData: CreateJobDto = {
      employerProfileId: employerProfile.id,
      title: data.title,
      description: data.description,
      requirements: requirementsArray,
      perks: perksArray,
      salaryMin: data.salaryMin || undefined,
      salaryMax: data.salaryMax || undefined,
      jobType: data.jobType,
      status: data.status,
      applicationDeadline: data.closingDate || undefined,
      organizationId: data.organizationId || undefined,
      locationId: data.locationId || undefined,
      specialtyIds: selectedSpecialties.map((s) => s.id),
    };

    createJobMutation.mutate(jobData);
  };

  const handleAddSpecialty = (specialtyId: string) => {
    const specialty = specialties.find((s) => s.id === specialtyId);
    if (specialty && !selectedSpecialties.find((s) => s.id === specialtyId)) {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  const handleRemoveSpecialty = (specialtyId: string) => {
    setSelectedSpecialties(selectedSpecialties.filter((s) => s.id !== specialtyId));
  };

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

  if (!user || user.role !== UserRole.employer) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Post a New Job</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Create a job posting to attract qualified medical professionals
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
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
                  variant="outline"
                  onClick={() => setShowOrgDialog(true)}
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
                  variant="outline"
                  onClick={() => setShowLocationDialog(true)}
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
              <Select onValueChange={handleAddSpecialty}>
                <SelectTrigger>
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
      <Dialog open={showOrgDialog} onOpenChange={setShowOrgDialog}>
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
            <Button variant="outline" onClick={() => setShowOrgDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrganization} disabled={createOrgMutation.isPending}>
              Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Location Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
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
            <Button variant="outline" onClick={() => setShowLocationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLocation} disabled={createLocationMutation.isPending}>
              Create Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
