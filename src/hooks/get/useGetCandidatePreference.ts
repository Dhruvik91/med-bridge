import { useQuery } from '@tanstack/react-query';
import { candidatePreferenceService } from '@/services/candidate-preference.service';

export const useGetCandidatePreference = (candidateId: string) => {
  return useQuery({
    queryKey: ['candidatePreference', candidateId],
    queryFn: () => candidatePreferenceService.findByCandidate(candidateId),
    enabled: !!candidateId,
  });
};
