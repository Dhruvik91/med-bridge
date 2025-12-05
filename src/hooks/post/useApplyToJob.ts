import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { applicationService } from '@/services/application.service';
import { useToast } from '@/hooks/use-toast';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { CreateApplicationDto } from '@/types';

export const useApplyToJob = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationDto) => applicationService.create(data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['candidateApplications'] });
      queryClient.invalidateQueries({ queryKey: ['allApplications'] });

      toast({
        title: 'Application submitted',
        description: 'Your application has been sent to the employer',
      });

      router.push(FRONTEND_ROUTES.DASHBOARD.CANDIDATE);
    },
    onError: (error: any) => {
      toast({
        title: error.response?.data?.message || 'Failed to submit application',
        description: error.response?.data?.message || 'Failed to submit application',
        variant: 'destructive',
      });
    },
  });
};
