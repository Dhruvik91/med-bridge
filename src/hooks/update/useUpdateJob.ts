import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '@/services/job.service';
import { useToast } from '@/hooks/use-toast';
import { UpdateJobDto } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { useRouter } from 'next/navigation';

export const useUpdateJob = (jobId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateJobDto) => jobService.update(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
      toast({
        title: 'Job updated',
        description: 'Your job posting has been updated successfully.',
      });
      router.push(FRONTEND_ROUTES.JOBS.MANAGE)
    },
    onError: () => {
      toast({
        title: 'Failed to update job posting.',
        description: 'Failed to update job posting.',
        variant: 'destructive',
      });
    },
  });
};
