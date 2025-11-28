import httpService from '@/lib/http-service';
import { Location, CreateLocationDto, UpdateLocationDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';

export const locationService = {
  async findAll(city?: string): Promise<Location[]> {
    const url = city ? `${API_CONFIG.path.locations}?city=${encodeURIComponent(city)}` : API_CONFIG.path.locations;
    const response = await httpService.get<Location[]>(url);
    return response.data;
  },

  async findOne(id: string): Promise<Location> {
    const response = await httpService.get<Location>(`${API_CONFIG.path.locations}/${id}`);
    return response.data;
  },

  async create(data: CreateLocationDto): Promise<Location> {
    const response = await httpService.post<Location>(API_CONFIG.path.locations, data);
    return response.data;
  },

  async update(id: string, data: UpdateLocationDto): Promise<Location> {
    const response = await httpService.patch<Location>(`${API_CONFIG.path.locations}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.locations}/${id}`);
  },
};
