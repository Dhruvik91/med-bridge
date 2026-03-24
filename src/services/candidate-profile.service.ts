import httpService from '@/lib/http-service';
import { CandidateProfile, CreateCandidateProfileDto, UpdateCandidateProfileDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';
import { Paginated } from '@/constants/interface';

export const candidateProfileService = {
  async findAll(params: Record<string, any> = {}): Promise<Paginated<CandidateProfile>> {
    const response = await httpService.get<Paginated<CandidateProfile>>(API_CONFIG.path.candidateProfiles.base, {
      params,
    });
    return response.data;
  },

  async findOne(id: string): Promise<CandidateProfile> {
    const response = await httpService.get<CandidateProfile>(`${API_CONFIG.path.candidateProfiles.base}/${id}`);
    return response.data;
  },

  async findByUser(userId: string): Promise<CandidateProfile> {
    const response = await httpService.get<CandidateProfile>(`${API_CONFIG.path.candidateProfiles.byUser}/${userId}`);
    return response.data;
  },

  async create(data: CreateCandidateProfileDto): Promise<CandidateProfile> {
    const response = await httpService.post<CandidateProfile>(API_CONFIG.path.candidateProfiles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateCandidateProfileDto): Promise<CandidateProfile> {
    const response = await httpService.patch<CandidateProfile>(`${API_CONFIG.path.candidateProfiles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.candidateProfiles.base}/${id}`);
  },
};
