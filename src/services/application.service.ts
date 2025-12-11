import httpService from '@/lib/http-service';
import { Application, CreateApplicationDto, UpdateApplicationDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';
import { Paginated } from '@/constants/interface';

export const applicationService = {
  async findAll(page = 1, limit = 20): Promise<Paginated<Application>> {
    const response = await httpService.get<Paginated<Application>>(API_CONFIG.path.applications.base, {
      params: { page, limit },
    });
    return response.data;
  },

  async findOne(id: string): Promise<Application> {
    const response = await httpService.get<Application>(`${API_CONFIG.path.applications.base}/${id}`);
    return response.data;
  },

  async findByCandidate(candidateId: string, page = 1, limit = 20): Promise<Paginated<Application>> {
    const response = await httpService.get<Paginated<Application>>(`${API_CONFIG.path.applications.candidateApplications}/${candidateId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  async findByJob(jobId: string, page = 1, limit = 20): Promise<Paginated<Application>> {
    const response = await httpService.get<Paginated<Application>>(`${API_CONFIG.path.applications.jobApplications}/${jobId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  async create(data: CreateApplicationDto): Promise<Application> {
    const response = await httpService.post<Application>(API_CONFIG.path.applications.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateApplicationDto): Promise<Application> {
    const response = await httpService.patch<Application>(`${API_CONFIG.path.applications.base}/${id}`, data);
    return response.data;
  },

  async withdraw(id: string): Promise<Application> {
    const response = await httpService.post<Application>(`${API_CONFIG.path.applications.base}/${id}/withdraw`);
    return response.data;
  },

  async archive(id: string): Promise<Application> {
    const response = await httpService.post<Application>(`${API_CONFIG.path.applications.base}/${id}/archive`);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.applications.base}/${id}`);
  },
};
