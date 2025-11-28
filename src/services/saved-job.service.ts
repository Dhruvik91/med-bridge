import httpService from '@/lib/http-service';
import { SavedJob, CreateSavedJobDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';

export const savedJobService = {
  async findByUser(userId: string): Promise<SavedJob[]> {
    const response = await httpService.get<SavedJob[]>(`${API_CONFIG.path.savedJobs.byUser}/${userId}`);
    return response.data;
  },

  async save(data: CreateSavedJobDto): Promise<SavedJob> {
    const response = await httpService.post<SavedJob>(API_CONFIG.path.savedJobs.base, data);
    return response.data;
  },

  async unsave(userId: string, jobId: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.savedJobs.base}/user/${userId}/job/${jobId}`);
  },
};
