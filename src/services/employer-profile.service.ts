import httpService from '@/lib/http-service';
import { EmployerProfile, CreateEmployerProfileDto, UpdateEmployerProfileDto } from '@/types';

export const employerProfileService = {
  async findAll(): Promise<EmployerProfile[]> {
    const response = await httpService.get<EmployerProfile[]>('/employer-profiles');
    return response.data;
  },

  async findOne(id: string): Promise<EmployerProfile> {
    const response = await httpService.get<EmployerProfile>(`/employer-profiles/${id}`);
    return response.data;
  },

  async findByUser(userId: string): Promise<EmployerProfile> {
    const response = await httpService.get<EmployerProfile>(`/employer-profiles/user/${userId}`);
    return response.data;
  },

  async create(data: CreateEmployerProfileDto): Promise<EmployerProfile> {
    const response = await httpService.post<EmployerProfile>('/employer-profiles', data);
    return response.data;
  },

  async update(id: string, data: UpdateEmployerProfileDto): Promise<EmployerProfile> {
    const response = await httpService.patch<EmployerProfile>(`/employer-profiles/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`/employer-profiles/${id}`);
  },
};
