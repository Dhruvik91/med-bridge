import { useForm } from 'react-hook-form';
import { JobType, JobStatus, CreateJobDto, Specialty } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSchema } from '@/lib/schemas';

export interface JobFormData {
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

interface UseJobFormProps {
  employerProfileId: string | undefined;
  selectedSpecialties: Specialty[];
  onSubmit: (data: CreateJobDto) => void;
}

export const useJobForm = ({ employerProfileId, selectedSpecialties, onSubmit }: UseJobFormProps) => {
  const { toast } = useToast();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      status: JobStatus.draft,
      jobType: JobType.full_time,
      specialtyIds: [],
    },
  });

  const handleFormSubmit = (data: JobFormData) => {
    if (!employerProfileId) {
      toast({
        title: 'Employer profile not found.',
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
      employerProfileId: employerProfileId,
      title: data.title,
      description: data.description,
      requirements: requirementsArray,
      perks: perksArray,
      salaryMin: String(data.salaryMin) || undefined,
      salaryMax: String(data.salaryMax) || undefined,
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
  };
};
