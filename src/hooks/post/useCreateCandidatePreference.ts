import { useMutation, useQueryClient } from '@tanstack/react-query';
import { candidatePreferenceService } from '@/services/candidate-preference.service';
import { CreateCandidatePreferenceDto, UpdateCandidatePreferenceDto } from '@/types';
import { toast } from 'sonner';

export const useCreateCandidatePreference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCandidatePreferenceDto) => candidatePreferenceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidatePreference'] });
      toast.success('Preferences saved successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to save preferences');
    },
  });
};

export const useUpsertCandidatePreference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ candidateId, data }: { candidateId: string; data: UpdateCandidatePreferenceDto }) =>
      candidatePreferenceService.upsert(candidateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidatePreference'] });
      toast.success('Preferences updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update preferences');
    },
  });
};
