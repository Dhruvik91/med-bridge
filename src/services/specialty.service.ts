import httpService from '@/lib/http-service';
import { Specialty, CreateSpecialtyDto, UpdateSpecialtyDto } from '@/types';

export const specialtyService = {
  async findAll(): Promise<Specialty[]> {
    const response = await httpService.get<Specialty[]>('/specialties');
    return response.data;
  },

  async findOne(id: string): Promise<Specialty> {
    const response = await httpService.get<Specialty>(`/specialties/${id}`);
    return response.data;
  },

  async findBySlug(slug: string): Promise<Specialty> {
    const response = await httpService.get<Specialty>(`/specialties/slug/${slug}`);
    return response.data;
  },

  async create(data: CreateSpecialtyDto): Promise<Specialty> {
    const response = await httpService.post<Specialty>('/specialties', data);
    return response.data;
  },

  async update(id: string, data: UpdateSpecialtyDto): Promise<Specialty> {
    const response = await httpService.patch<Specialty>(`/specialties/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`/specialties/${id}`);
  },
};
