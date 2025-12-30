import httpService from '@/lib/http-service';
import { Job, CreateJobDto, UpdateJobDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';
import { Paginated } from '@/constants/interface';

export const jobService = {
  async findAll(params: Record<string, any> = {}): Promise<Paginated<Job>> {
    const response = await httpService.get<Paginated<Job>>(API_CONFIG.path.jobs.base, {
      params,
    });
    return response.data;
  },

  async findOne(id: string): Promise<Job> {
    const response = await httpService.get<Job>(`${API_CONFIG.path.jobs.base}/${id}`);
    return response.data;
  },

  async findByEmployer(employerProfileId: string, page = 1, limit = 20): Promise<Paginated<Job>> {
    const response = await httpService.get<Paginated<Job>>(`${API_CONFIG.path.jobs.byEmployer}/${employerProfileId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  async findByOrganization(organizationId: string, page = 1, limit = 20): Promise<Paginated<Job>> {
    const response = await httpService.get<Paginated<Job>>(`${API_CONFIG.path.jobs.byOrganization}/${organizationId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  async findByLocation(locationId: string, page = 1, limit = 20): Promise<Paginated<Job>> {
    const response = await httpService.get<Paginated<Job>>(`${API_CONFIG.path.jobs.byLocation}/${locationId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  async incrementViews(id: string): Promise<void> {
    await httpService.post(`${API_CONFIG.path.jobs.base}/${id}/view`);
  },

  async create(data: CreateJobDto): Promise<Job> {
    const response = await httpService.post<Job>(API_CONFIG.path.jobs.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateJobDto): Promise<Job> {
    const response = await httpService.patch<Job>(`${API_CONFIG.path.jobs.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.jobs.base}/${id}`);
  },
};
