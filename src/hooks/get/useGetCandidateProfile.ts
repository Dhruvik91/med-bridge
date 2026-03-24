import { useQuery } from '@tanstack/react-query';
import { candidateProfileService } from '@/services/candidate-profile.service';

export const useGetCandidateProfile = (id: string) => {
  return useQuery({
    queryKey: ['candidateProfile', id],
    queryFn: () => candidateProfileService.findOne(id),
    enabled: !!id,
  });
};

export const useGetCandidateProfileByUser = (userId: string) => {
  return useQuery({
    queryKey: ['candidateProfile', 'user', userId],
    queryFn: () => candidateProfileService.findByUser(userId),
    enabled: !!userId,
  });
};
