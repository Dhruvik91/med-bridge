import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/services/application.service';
import { useToast } from '@/hooks/use-toast';

export const useArchiveApplication = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => applicationService.archive(id),
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['candidateApplications'] });
            queryClient.invalidateQueries({ queryKey: ['allApplications'] });
            queryClient.invalidateQueries({ queryKey: ['application'] });

            toast({
                title: 'Application archived',
                description: 'The application has been moved to archive',
            });
        },
        onError: (error: any) => {
            toast({
                title: error.response?.data?.message || 'Failed to archive application',
                description: error.response?.data?.message || 'Something went wrong',
                variant: 'destructive',
            });
        },
    });
};
