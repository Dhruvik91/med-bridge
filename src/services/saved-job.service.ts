import httpService from '@/lib/http-service';
import { SavedJob, CreateSavedJobDto } from '@/types';

export const savedJobService = {
  async findByUser(userId: string): Promise<SavedJob[]> {
    const response = await httpService.get<SavedJob[]>(`/saved-jobs/user/${userId}`);
    return response.data;
  },

  async save(data: CreateSavedJobDto): Promise<SavedJob> {
    const response = await httpService.post<SavedJob>('/saved-jobs', data);
    return response.data;
  },

  async unsave(userId: string, jobId: string): Promise<void> {
    await httpService.delete(`/saved-jobs/user/${userId}/job/${jobId}`);
  },
};
