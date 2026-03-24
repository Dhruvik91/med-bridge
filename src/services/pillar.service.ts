import httpService from '@/lib/http-service';
import { Pillar, CreatePillarDto, UpdatePillarDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';
import { Paginated } from '@/constants/interface';

export const pillarService = {
  async findAll(params: Record<string, any> = {}): Promise<Paginated<Pillar>> {
    const response = await httpService.get<Paginated<Pillar>>(API_CONFIG.path.pillars.base, {
      params,
    });
    return response.data;
  },

  async findOne(id: string): Promise<Pillar> {
    const response = await httpService.get<Pillar>(`${API_CONFIG.path.pillars.base}/${id}`);
    return response.data;
  },

  async create(data: CreatePillarDto): Promise<Pillar> {
    const response = await httpService.post<Pillar>(API_CONFIG.path.pillars.base, data);
    return response.data;
  },

  async update(id: string, data: UpdatePillarDto): Promise<Pillar> {
    const response = await httpService.patch<Pillar>(`${API_CONFIG.path.pillars.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.pillars.base}/${id}`);
  },
};
