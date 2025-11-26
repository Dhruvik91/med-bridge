import httpService from '@/lib/http-service';
import { Job, CreateJobDto, UpdateJobDto } from '@/types';

export const jobService = {
  async findAll(): Promise<Job[]> {
    const response = await httpService.get<Job[]>('/jobs');
    return response.data;
  },

  async findOne(id: string): Promise<Job> {
    const response = await httpService.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  async findByEmployer(employerProfileId: string): Promise<Job[]> {
    const response = await httpService.get<Job[]>(`/jobs/employer/${employerProfileId}`);
    return response.data;
  },

  async findByOrganization(organizationId: string): Promise<Job[]> {
    const response = await httpService.get<Job[]>(`/jobs/organization/${organizationId}`);
    return response.data;
  },

  async findByLocation(locationId: string): Promise<Job[]> {
    const response = await httpService.get<Job[]>(`/jobs/location/${locationId}`);
    return response.data;
  },

  async incrementViews(id: string): Promise<void> {
    await httpService.post(`/jobs/${id}/view`);
  },

  async create(data: CreateJobDto): Promise<Job> {
    const response = await httpService.post<Job>('/jobs', data);
    return response.data;
  },

  async update(id: string, data: UpdateJobDto): Promise<Job> {
    const response = await httpService.patch<Job>(`/jobs/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`/jobs/${id}`);
  },
};
