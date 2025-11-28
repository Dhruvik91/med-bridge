import httpService from '@/lib/http-service';
import { DoctorProfile, CreateDoctorProfileDto, UpdateDoctorProfileDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';

export const doctorProfileService = {
  async findAll(): Promise<DoctorProfile[]> {
    const response = await httpService.get<DoctorProfile[]>(API_CONFIG.path.doctorsProfiles.base);
    return response.data;
  },

  async findOne(id: string): Promise<DoctorProfile> {
    const response = await httpService.get<DoctorProfile>(`${API_CONFIG.path.doctorsProfiles.base}/${id}`);
    return response.data;
  },

  async findByUser(userId: string): Promise<DoctorProfile> {
    const response = await httpService.get<DoctorProfile>(`${API_CONFIG.path.doctorsProfiles.byUser}/${userId}`);
    return response.data;
  },

  async create(data: CreateDoctorProfileDto): Promise<DoctorProfile> {
    const response = await httpService.post<DoctorProfile>(API_CONFIG.path.doctorsProfiles.base, data);
    return response.data;
  },

  async update(id: string, data: UpdateDoctorProfileDto): Promise<DoctorProfile> {
    const response = await httpService.patch<DoctorProfile>(`${API_CONFIG.path.doctorsProfiles.base}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.doctorsProfiles.base}/${id}`);
  },
};
