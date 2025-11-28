import httpService from '@/lib/http-service';
import { EmployerProfile, CreateEmployerProfileDto, UpdateEmployerProfileDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';

export const employerProfileService = {
  async findAll(): Promise<EmployerProfile[]> {
    const response = await httpService.get<EmployerProfile[]>(API_CONFIG.path.employerProfiles.base);
    return response.data;
  },

  async findOne(id: string): Promise<EmployerProfile> {
    const response = await httpService.get<EmployerProfile>(`${API_CONFIG.path.employerProfiles.base}/${id}`);
    return response.data;
  },

  async findByUser(userId: string): Promise<EmployerProfile> {
    const response = await httpService.get<EmployerProfile>(`${API_CONFIG.path.employerProfiles.byUser}/${userId}`);
    return response.data;
  },

  async create(data: CreateEmployerProfileDto): Promise<EmployerProfile> {
    const response = await httpService.post<EmployerProfile>(API_CONFIG.path.employerProfiles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateEmployerProfileDto): Promise<EmployerProfile> {
    const response = await httpService.patch<EmployerProfile>(`${API_CONFIG.path.employerProfiles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.employerProfiles.base}/${id}`);
  },
};
