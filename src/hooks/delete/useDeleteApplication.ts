import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/services/application.service';
import { useToast } from '@/hooks/use-toast';

export const useDeleteApplication = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => applicationService.remove(id),
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['candidateApplications'] });
            queryClient.invalidateQueries({ queryKey: ['allApplications'] });
            queryClient.invalidateQueries({ queryKey: ['jobApplications'] });

            toast({
                title: 'Application deleted',
                description: 'The application has been deleted successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: error.response?.data?.message || 'Failed to delete application',
                description: error.response?.data?.message || 'Something went wrong',
                variant: 'destructive',
            });
        },
    });
};
