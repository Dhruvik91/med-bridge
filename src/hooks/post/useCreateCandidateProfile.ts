import { useMutation, useQueryClient } from '@tanstack/react-query';
import { candidateProfileService } from '@/services/candidate-profile.service';
import { CreateCandidateProfileDto } from '@/types';
import { toast } from 'sonner';

export const useCreateCandidateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCandidateProfileDto) => candidateProfileService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['candidateProfile'] });
      toast.success('Profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create profile');
    },
  });
};
