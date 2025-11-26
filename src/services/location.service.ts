import httpService from '@/lib/http-service';
import { Location, CreateLocationDto, UpdateLocationDto } from '@/types';

export const locationService = {
  async findAll(city?: string): Promise<Location[]> {
    const url = city ? `/locations?city=${encodeURIComponent(city)}` : '/locations';
    const response = await httpService.get<Location[]>(url);
    return response.data;
  },

  async findOne(id: string): Promise<Location> {
    const response = await httpService.get<Location>(`/locations/${id}`);
    return response.data;
  },

  async create(data: CreateLocationDto): Promise<Location> {
    const response = await httpService.post<Location>('/locations', data);
    return response.data;
  },

  async update(id: string, data: UpdateLocationDto): Promise<Location> {
    const response = await httpService.patch<Location>(`/locations/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`/locations/${id}`);
  },
};
