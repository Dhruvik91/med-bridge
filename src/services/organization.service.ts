import httpService from '@/lib/http-service';
import { Organization, CreateOrganizationDto, UpdateOrganizationDto } from '@/types';

export const organizationService = {
  async findAll(): Promise<Organization[]> {
    const response = await httpService.get<Organization[]>('/organizations');
    return response.data;
  },

  async findOne(id: string): Promise<Organization> {
    const response = await httpService.get<Organization>(`/organizations/${id}`);
    return response.data;
  },

  async findByEmployer(employerProfileId: string): Promise<Organization[]> {
    const response = await httpService.get<Organization[]>(`/organizations/employer/${employerProfileId}`);
    return response.data;
  },

  async create(data: CreateOrganizationDto): Promise<Organization> {
    const response = await httpService.post<Organization>('/organizations', data);
    return response.data;
  },

  async update(id: string, data: UpdateOrganizationDto): Promise<Organization> {
    const response = await httpService.patch<Organization>(`/organizations/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`/organizations/${id}`);
  },
};
