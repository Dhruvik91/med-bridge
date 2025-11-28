import { useMutation, useQueryClient } from '@tanstack/react-query';
import { locationService } from '@/services/location.service';
import { useToast } from '@/hooks/use-toast';
import { CreateLocationDto } from '@/types';

interface UseCreateLocationProps {
  onSuccess?: (locationId: string) => void;
  onDialogClose?: () => void;
}

export const useCreateLocation = ({ onSuccess, onDialogClose }: UseCreateLocationProps = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLocationDto) => locationService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      onSuccess?.(data.id);
      onDialogClose?.();
      toast({
        title: 'Location created',
        description: 'Your location has been created successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create location.',
        variant: 'destructive',
      });
    },
  });
};
