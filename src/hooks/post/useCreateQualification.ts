import { useMutation, useQueryClient } from '@tanstack/react-query';
import { qualificationService } from '@/services/qualification.service';
import { useToast } from '@/hooks/use-toast';
import { CreateQualificationDto, Qualification } from '@/types';

interface UseCreateQualificationProps {
    onSuccess?: (qualification: Qualification) => void;
    onDialogClose?: () => void;
}

export const useCreateQualification = ({ onSuccess, onDialogClose }: UseCreateQualificationProps = {}) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateQualificationDto) => qualificationService.create(data),
        onSuccess: (qualification) => {
            queryClient.invalidateQueries({ queryKey: ['qualifications'] });
            toast({
                title: `${qualification.name} has been created successfully.`,
                description: `${qualification.name} has been created successfully.`,
            });
            onSuccess?.(qualification);
            onDialogClose?.();
        },
        onError: () => {
            toast({
                title: 'Failed to create qualification.',
                description: 'Failed to create qualification.',
                variant: 'destructive',
            });
        },
    });
};
