import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { doctorProfileService } from '@/services/doctor-profile.service';
import { useToast } from '@/hooks/use-toast';
import { CreateDoctorProfileDto } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';

export const useCreateDoctorProfile = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDoctorProfileDto) => doctorProfileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
      toast({
        title: 'Profile created',
        description: 'Your doctor profile has been created successfully.',
      });
      router.push(FRONTEND_ROUTES.DASHBOARD.CANDIDATE);
    },
    onError: () => {
      toast({
        title: 'Failed to create doctor profile.',
        description: 'Failed to create doctor profile.',
        variant: 'destructive',
      });
    },
  });
};
