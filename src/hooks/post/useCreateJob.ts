import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { jobService } from '@/services/job.service';
import { useToast } from '@/hooks/use-toast';
import { CreateJobDto } from '@/types';

export const useCreateJob = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
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
};
