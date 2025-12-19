import httpService from '@/lib/http-service';
import { Qualification, CreateQualificationDto, UpdateQualificationDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';
import { Paginated } from '@/constants/interface';

export const qualificationService = {
    async findAll(page = 1, limit = 100): Promise<Paginated<Qualification>> {
        const response = await httpService.get<Paginated<Qualification>>(API_CONFIG.path.qualifications.base, {
            params: { page, limit },
        });
        return response.data;
    },

    async findOne(id: string): Promise<Qualification> {
        const response = await httpService.get<Qualification>(`${API_CONFIG.path.qualifications.base}/${id}`);
        return response.data;
    },

    async findBySlug(slug: string): Promise<Qualification> {
        const response = await httpService.get<Qualification>(`${API_CONFIG.path.qualifications.bySlug}/${slug}`);
        return response.data;
    },

    async create(data: CreateQualificationDto): Promise<Qualification> {
        const response = await httpService.post<Qualification>(API_CONFIG.path.qualifications.base, data);
        return response.data;
    },

    async update(id: string, data: UpdateQualificationDto): Promise<Qualification> {
        const response = await httpService.patch<Qualification>(`${API_CONFIG.path.qualifications.base}/${id}`, data);
        return response.data;
    },

    async remove(id: string): Promise<void> {
        await httpService.delete(`${API_CONFIG.path.qualifications.base}/${id}`);
    },
};
