import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '@/services/job.service';
import { useToast } from '@/hooks/use-toast';

export const useDeleteJob = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobService.remove(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
      toast({
        title: 'Job deleted',
        description: 'Your job posting has been deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete job posting.',
        variant: 'destructive',
      });
    },
  });
};
