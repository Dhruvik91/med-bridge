import { useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '@/services/organization.service';
import { useToast } from '@/hooks/use-toast';
import { CreateOrganizationDto } from '@/types';

interface UseCreateOrganizationProps {
  onSuccess?: (organizationId: string) => void;
  onDialogClose?: () => void;
}

export const useCreateOrganization = ({ onSuccess, onDialogClose }: UseCreateOrganizationProps = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationDto) => organizationService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      onSuccess?.(data.id);
      onDialogClose?.();
      toast({
        title: 'Organization created',
        description: 'Your organization has been created successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to create organization.',
        description: 'Failed to create organization.',
        variant: 'destructive',
      });
    },
  });
};
