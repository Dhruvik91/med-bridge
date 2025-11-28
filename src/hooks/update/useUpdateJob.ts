import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '@/services/job.service';
import { useToast } from '@/hooks/use-toast';
import { UpdateJobDto } from '@/types';

export const useUpdateJob = (jobId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update job posting.',
        variant: 'destructive',
      });
    },
  });
};
