import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { jobService } from '@/services/job.service';
import { useToast } from '@/hooks/use-toast';
import { CreateJobDto } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';

export const useCreateJob = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobDto) => jobService.create(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['jobs'] }),
        queryClient.invalidateQueries({ queryKey: ['job'] }),
        queryClient.invalidateQueries({ queryKey: ['employerJobs'] }),
      ]);
      toast({
        title: 'Job created',
        description: 'Your job posting has been created successfully.',
      });
      router.push(FRONTEND_ROUTES.JOBS.MANAGE);
    },
    onError: () => {
      toast({
        title: 'Failed to create job posting.',
        description: 'Failed to create job posting.',
        variant: 'destructive',
      });
    },
  });
};
