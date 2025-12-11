import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { employerProfileService } from '@/services/employer-profile.service';
import { useToast } from '@/hooks/use-toast';
import { CreateEmployerProfileDto } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';

export const useCreateEmployerProfile = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployerProfileDto) => employerProfileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
      toast({
        title: 'Profile created',
        description: 'Your employer profile has been created successfully.',
      });
      router.push(FRONTEND_ROUTES.DASHBOARD.EMPLOYER);
    },
    onError: () => {
      toast({
        title: 'Failed to create employer profile.',
        description: 'Failed to create employer profile.',
        variant: 'destructive',
      });
    },
  });
};
