import { useMutation, useQueryClient } from '@tanstack/react-query';
import { savedJobService } from '@/services/saved-job.service';
import { useToast } from '@/hooks/use-toast';
import { CreateSavedJobDto } from '@/types';

export const useSaveJob = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSavedJobDto) => savedJobService.save(data),
    onSuccess: (data) => {
      queryClient.setQueriesData(
        { queryKey: ['savedJobs'] },
        (oldData: any) => {
          if (!oldData) {
            return oldData;
          }

          if (Array.isArray(oldData)) {
            return [...oldData, data];
          }

          if (Array.isArray(oldData.items)) {
            return {
              ...oldData,
              items: [...oldData.items, data],
            };
          }

          return oldData;
        }
      );

      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
      
      toast({
        title: 'Job saved',
        description: 'Job added to saved jobs',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Save failed',
        description: error.response?.data?.message || 'Failed to save job',
        variant: 'destructive',
      });
    },
  });
};

export const useUnsaveJob = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, jobId }: { userId: string; jobId: string }) => 
      savedJobService.unsave(userId, jobId),
    onSuccess: () => {
      // Invalidate saved jobs queries
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
      
      toast({
        title: 'Job removed',
        description: 'Job removed from saved jobs',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Remove failed',
        description: error.response?.data?.message || 'Failed to remove job',
        variant: 'destructive',
      });
    },
  });
};
