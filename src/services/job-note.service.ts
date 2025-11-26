import httpService from '@/lib/http-service';
import { JobNote, CreateJobNoteDto, UpdateJobNoteDto } from '@/types';

export const jobNoteService = {
  async findAll(): Promise<JobNote[]> {
    const response = await httpService.get<JobNote[]>('/job-notes');
    return response.data;
  },

  async findOne(id: string): Promise<JobNote> {
    const response = await httpService.get<JobNote>(`/job-notes/${id}`);
    return response.data;
  },

  async findByJob(jobId: string): Promise<JobNote[]> {
    const response = await httpService.get<JobNote[]>(`/job-notes/job/${jobId}`);
    return response.data;
  },

  async findByApplication(applicationId: string): Promise<JobNote[]> {
    const response = await httpService.get<JobNote[]>(`/job-notes/application/${applicationId}`);
    return response.data;
  },

  async create(data: CreateJobNoteDto): Promise<JobNote> {
    const response = await httpService.post<JobNote>('/job-notes', data);
    return response.data;
  },

  async update(id: string, data: UpdateJobNoteDto): Promise<JobNote> {
    const response = await httpService.patch<JobNote>(`/job-notes/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`/job-notes/${id}`);
  },
};
