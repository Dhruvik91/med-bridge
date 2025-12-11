import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { employerProfileService } from '@/services/employer-profile.service';
import { useToast } from '@/hooks/use-toast';
import { UpdateEmployerProfileDto } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';

export const useUpdateEmployerProfile = (profileId: string) => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmployerProfileDto) => employerProfileService.update(profileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
      toast({
        title: 'Profile updated',
        description: 'Your employer profile has been updated successfully.',
      });
      router.push(FRONTEND_ROUTES.PROFILE.BASE);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update employer profile.',
        variant: 'destructive',
      });
    },
  });
};
