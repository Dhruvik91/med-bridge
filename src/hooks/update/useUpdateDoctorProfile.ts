import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { doctorProfileService } from '@/services/doctor-profile.service';
import { useToast } from '@/hooks/use-toast';
import { UpdateDoctorProfileDto } from '@/types';

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
      router.push('/profile');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update doctor profile.',
        variant: 'destructive',
      });
    },
  });
};
