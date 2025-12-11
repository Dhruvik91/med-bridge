import httpService from '@/lib/http-service';
import { SavedJob, CreateSavedJobDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';
import { Paginated } from '@/constants/interface';

export const savedJobService = {
  async findByUser(userId: string, page = 1, limit = 20): Promise<Paginated<SavedJob>> {
    const response = await httpService.get<Paginated<SavedJob>>(
      `${API_CONFIG.path.savedJobs.byUser}/${userId}`,
      {
        params: { page, limit },
      },
    );
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
