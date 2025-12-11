import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { applicationService } from '@/services/application.service';
import { useToast } from '@/hooks/use-toast';
import { UpdateApplicationDto } from '@/types';

export const useUpdateApplication = (applicationId: string) => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateApplicationDto) => applicationService.update(applicationId, data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['allApplications'] });
      queryClient.invalidateQueries({ queryKey: ['candidateApplications'] });
      queryClient.invalidateQueries({ queryKey: ['employerApplications'] });

      toast({
        title: 'Application updated successfully',
        description: 'The application status has been updated.',
      });
    },
    onError: (error: any) => {
      toast({
        title: error.response?.data?.message[0] || 'Failed to update application',
        description: error.response?.data?.message || 'Failed to update application',
        variant: 'destructive',
      });
    },
  });
};
