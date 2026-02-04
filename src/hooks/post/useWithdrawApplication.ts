import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/services/application.service';
import { useToast } from '@/hooks/use-toast';

export const useWithdrawApplication = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => applicationService.withdraw(id),
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['candidateApplications'] });
            queryClient.invalidateQueries({ queryKey: ['allApplications'] });
            queryClient.invalidateQueries({ queryKey: ['application'] });

            toast({
                title: 'Application withdrawn',
                description: 'Your application has been successfully withdrawn',
            });
        },
        onError: (error: any) => {
            toast({
                title: error.response?.data?.message || 'Failed to withdraw application',
                description: error.response?.data?.message || 'Something went wrong',
                variant: 'destructive',
            });
        },
    });
};
