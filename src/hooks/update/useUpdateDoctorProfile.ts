import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { doctorProfileService } from '@/services/doctor-profile.service';
import { useToast } from '@/hooks/use-toast';
import { UpdateDoctorProfileDto } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';

export const useUpdateDoctorProfile = (profileId: string) => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDoctorProfileDto) => doctorProfileService.update(profileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
      toast({
        title: 'Profile updated',
        description: 'Your doctor profile has been updated successfully.',
      });
      router.push(FRONTEND_ROUTES.PROFILE.BASE);
    },
    onError: (error: any) => {
      toast({
        title: error.response?.data?.message[0] || 'Failed to update doctor profile.',
        description: error.response?.data?.message || 'Failed to update doctor profile.',
        variant: 'destructive',
      });
    },
  });
};
