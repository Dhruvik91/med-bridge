import httpService from '@/lib/http-service';
import { JobNote, CreateJobNoteDto, UpdateJobNoteDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';

export const jobNoteService = {
  async findAll(): Promise<JobNote[]> {
    const response = await httpService.get<JobNote[]>(API_CONFIG.path.jobNotes.base);
    return response.data;
  },

  async findOne(id: string): Promise<JobNote> {
    const response = await httpService.get<JobNote>(`${API_CONFIG.path.jobNotes.base}/${id}`);
    return response.data;
  },

  async findByJob(jobId: string): Promise<JobNote[]> {
    const response = await httpService.get<JobNote[]>(`${API_CONFIG.path.jobNotes.byJob}/${jobId}`);
    return response.data;
  },

  async findByApplication(applicationId: string): Promise<JobNote[]> {
    const response = await httpService.get<JobNote[]>(`${API_CONFIG.path.jobNotes.byApplication}/${applicationId}`);
    return response.data;
  },

  async create(data: CreateJobNoteDto): Promise<JobNote> {
    const response = await httpService.post<JobNote>(`${API_CONFIG.path.jobNotes.base}`, data);
    return response.data;
  },

  async update(id: string, data: UpdateJobNoteDto): Promise<JobNote> {
    const response = await httpService.patch<JobNote>(`${API_CONFIG.path.jobNotes.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.jobNotes.base}/${id}`);
  },
};
