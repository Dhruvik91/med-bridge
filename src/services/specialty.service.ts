import httpService from '@/lib/http-service';
import { Specialty, CreateSpecialtyDto, UpdateSpecialtyDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';
import { Paginated } from '@/constants/interface';

export const specialtyService = {
  async findAll(page = 1, limit = 100): Promise<Paginated<Specialty>> {
    const response = await httpService.get<Paginated<Specialty>>(API_CONFIG.path.specialties.base, {
      params: { page, limit },
    });
    return response.data;
  },

  async findOne(id: string): Promise<Specialty> {
    const response = await httpService.get<Specialty>(`${API_CONFIG.path.specialties.base}/${id}`);
    return response.data;
  },

  async findBySlug(slug: string): Promise<Specialty> {
    const response = await httpService.get<Specialty>(`${API_CONFIG.path.specialties.bySlug}/${slug}`);
    return response.data;
  },

  async create(data: CreateSpecialtyDto): Promise<Specialty> {
    const response = await httpService.post<Specialty>(API_CONFIG.path.specialties.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateSpecialtyDto): Promise<Specialty> {
    const response = await httpService.patch<Specialty>(`${API_CONFIG.path.specialties.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.specialties.base}/${id}`);
  },
};
