import httpService from '@/lib/http-service';
import { CandidatePreference, CreateCandidatePreferenceDto, UpdateCandidatePreferenceDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';

export const candidatePreferenceService = {
  async findByCandidate(candidateId: string): Promise<CandidatePreference> {
    const response = await httpService.get<CandidatePreference>(`${API_CONFIG.path.candidatePreferences.byCandidate}/${candidateId}`);
    return response.data;
  },

  async create(data: CreateCandidatePreferenceDto): Promise<CandidatePreference> {
    const response = await httpService.post<CandidatePreference>(API_CONFIG.path.candidatePreferences.base, data);
    return response.data;
  },

  async upsert(candidateId: string, data: UpdateCandidatePreferenceDto): Promise<CandidatePreference> {
    const response = await httpService.patch<CandidatePreference>(`${API_CONFIG.path.candidatePreferences.byCandidate}/${candidateId}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.candidatePreferences.base}/${id}`);
  },
};
