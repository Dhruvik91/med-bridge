import httpService from '@/lib/http-service';
import { Organization, CreateOrganizationDto, UpdateOrganizationDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';
import { Paginated } from '@/constants/interface';

export const organizationService = {
  async findAll(): Promise<Organization[]> {
    const response = await httpService.get<Organization[]>(API_CONFIG.path.organizations.base);
    return response.data;
  },

  async findOne(id: string): Promise<Organization> {
    const response = await httpService.get<Organization>(`${API_CONFIG.path.organizations.base}/${id}`);
    return response.data;
  },

  async findByEmployer(
    employerProfileId: string,
    page = 1,
    limit = 20,
  ): Promise<Paginated<Organization>> {
    const response = await httpService.get<Paginated<Organization>>(
      `${API_CONFIG.path.organizations.byEmployer}/${employerProfileId}`,
      {
        params: { page, limit },
      },
    );
    return response.data;
  },

  async create(data: CreateOrganizationDto): Promise<Organization> {
    const response = await httpService.post<Organization>(API_CONFIG.path.organizations.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateOrganizationDto): Promise<Organization> {
    const response = await httpService.patch<Organization>(`${API_CONFIG.path.organizations.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.organizations.base}/${id}`);
  },
};
