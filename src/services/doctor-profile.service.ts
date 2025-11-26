import httpService from '@/lib/http-service';
import { DoctorProfile, CreateDoctorProfileDto, UpdateDoctorProfileDto } from '@/types';

export const doctorProfileService = {
  async findAll(): Promise<DoctorProfile[]> {
    const response = await httpService.get<DoctorProfile[]>('/doctor-profiles');
    return response.data;
  },

  async findOne(id: string): Promise<DoctorProfile> {
    const response = await httpService.get<DoctorProfile>(`/doctor-profiles/${id}`);
    return response.data;
  },

  async findByUser(userId: string): Promise<DoctorProfile> {
    const response = await httpService.get<DoctorProfile>(`/doctor-profiles/user/${userId}`);
    return response.data;
  },

  async create(data: CreateDoctorProfileDto): Promise<DoctorProfile> {
    const response = await httpService.post<DoctorProfile>('/doctor-profiles', data);
    return response.data;
  },

  async update(id: string, data: UpdateDoctorProfileDto): Promise<DoctorProfile> {
    const response = await httpService.patch<DoctorProfile>(`/doctor-profiles/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`/doctor-profiles/${id}`);
  },
};
