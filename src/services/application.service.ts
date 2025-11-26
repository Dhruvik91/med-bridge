import httpService from '@/lib/http-service';
import { Application, CreateApplicationDto, UpdateApplicationDto } from '@/types';

export const applicationService = {
  async findAll(): Promise<Application[]> {
    const response = await httpService.get<Application[]>('/applications');
    return response.data;
  },

  async findOne(id: string): Promise<Application> {
    const response = await httpService.get<Application>(`/applications/${id}`);
    return response.data;
  },

  async findByCandidate(candidateId: string): Promise<Application[]> {
    const response = await httpService.get<Application[]>(`/applications/candidate/${candidateId}`);
    return response.data;
  },

  async findByJob(jobId: string): Promise<Application[]> {
    const response = await httpService.get<Application[]>(`/applications/job/${jobId}`);
    return response.data;
  },

  async create(data: CreateApplicationDto): Promise<Application> {
    const response = await httpService.post<Application>('/applications', data);
    return response.data;
  },

  async update(id: string, data: UpdateApplicationDto): Promise<Application> {
    const response = await httpService.patch<Application>(`/applications/${id}`, data);
    return response.data;
  },

  async withdraw(id: string): Promise<Application> {
    const response = await httpService.post<Application>(`/applications/${id}/withdraw`);
    return response.data;
  },

  async archive(id: string): Promise<Application> {
    const response = await httpService.post<Application>(`/applications/${id}/archive`);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`/applications/${id}`);
  },
};
