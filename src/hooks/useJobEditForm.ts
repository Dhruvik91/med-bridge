import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { JobType, JobStatus, UpdateJobDto, Specialty, Job } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface JobEditFormData {
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

interface UseJobEditFormProps {
  job: Job | undefined;
  employerProfileId: string | undefined;
  selectedSpecialties: Specialty[];
  onSubmit: (data: UpdateJobDto) => void;
}

export const useJobEditForm = ({ job, employerProfileId, selectedSpecialties, onSubmit }: UseJobEditFormProps) => {
  const { toast } = useToast();
  const [isFormReady, setIsFormReady] = useState(false);

  const form = useForm<JobEditFormData>({
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      benefits: '',
      salaryMin: '',
      salaryMax: '',
      status: JobStatus.draft,
      jobType: JobType.full_time,
      closingDate: '',
      organizationId: '',
      locationId: '',
      specialtyIds: [],
    },
  });

  // Populate form when job data is available
  useEffect(() => {
    if (job) {
      // Job requirements and benefits are already strings, not arrays
      const requirementsString = Array.isArray(job.requirements)
        ? job.requirements.join('\n')
        : job.requirements || '';
      const benefitsString = job.benefits || '';

      // Format date for input field
      const formattedClosingDate = job.closingDate
        ? new Date(job.closingDate).toISOString().split('T')[0]
        : '';

      form.reset({
        title: job.title,
        description: job.description,
        requirements: requirementsString,
        benefits: benefitsString,
        salaryMin: job.salaryMin?.toString() || '',
        salaryMax: job.salaryMax?.toString() || '',
        jobType: job.jobType,
        status: job.status,
        closingDate: formattedClosingDate,
        organizationId: job.organizationId || '',
        locationId: job.locationId || '',
        specialtyIds: job.specialties?.map(s => s.id) || [],
      });

      setIsFormReady(true);
    }
  }, [job, form]);

  const handleFormSubmit = (data: JobEditFormData) => {
    if (!employerProfileId) {
      toast({
        title: 'Error',
        description: 'Employer profile not found.',
        variant: 'destructive',
      });
      return;
    }

    if (!job) {
      toast({
        title: 'Error',
        description: 'Job data not found.',
        variant: 'destructive',
      });
      return;
    }

    // Convert textarea strings to arrays by splitting on newlines
    const requirementsArray = data.requirements && typeof data.requirements === 'string'
      ? data.requirements.split('\n').filter((line) => line.trim())
      : undefined;
    const perksArray = data.benefits && typeof data.benefits === 'string'
      ? data.benefits.split('\n').filter((line) => line.trim())
      : undefined;

    const jobData: UpdateJobDto = {
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

    onSubmit(jobData);
  };

  return {
    form,
    handleFormSubmit,
    isFormReady,
  };
};
