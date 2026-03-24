import httpService from '@/lib/http-service';
import { JobRole, CreateJobRoleDto, UpdateJobRoleDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';
import { Paginated } from '@/constants/interface';

export const jobRoleService = {
  async findAll(params: Record<string, any> = {}): Promise<Paginated<JobRole>> {
    const response = await httpService.get<Paginated<JobRole>>(API_CONFIG.path.jobRoles.base, {
      params,
    });
    return response.data;
  },

  async findOne(id: string): Promise<JobRole> {
    const response = await httpService.get<JobRole>(`${API_CONFIG.path.jobRoles.base}/${id}`);
    return response.data;
  },

  async findByPillar(pillarId: string): Promise<JobRole[]> {
    const response = await httpService.get<JobRole[]>(`${API_CONFIG.path.jobRoles.byPillar}/${pillarId}`);
    return response.data;
  },

  async create(data: CreateJobRoleDto): Promise<JobRole> {
    const response = await httpService.post<JobRole>(API_CONFIG.path.jobRoles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateJobRoleDto): Promise<JobRole> {
    const response = await httpService.patch<JobRole>(`${API_CONFIG.path.jobRoles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.jobRoles.base}/${id}`);
  },
};
