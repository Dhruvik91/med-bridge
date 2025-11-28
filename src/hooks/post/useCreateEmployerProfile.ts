import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { employerProfileService } from '@/services/employer-profile.service';
import { useToast } from '@/hooks/use-toast';
import { CreateEmployerProfileDto } from '@/types';

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
      router.push('/dashboard/employer');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create employer profile.',
        variant: 'destructive',
      });
    },
  });
};
