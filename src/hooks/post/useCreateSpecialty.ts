import { useMutation, useQueryClient } from '@tanstack/react-query';
import { specialtyService } from '@/services/specialty.service';
import { useToast } from '@/hooks/use-toast';
import { CreateSpecialtyDto, Specialty } from '@/types';

interface UseCreateSpecialtyProps {
  onSuccess?: (specialty: Specialty) => void;
  onDialogClose?: () => void;
}

export const useCreateSpecialty = ({ onSuccess, onDialogClose }: UseCreateSpecialtyProps = {}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSpecialtyDto) => specialtyService.create(data),
    onSuccess: (specialty) => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      toast({
        title: 'Specialty created',
        description: `${specialty.name} has been created successfully.`,
      });
      onSuccess?.(specialty);
      onDialogClose?.();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create specialty.',
        variant: 'destructive',
      });
    },
  });
};
