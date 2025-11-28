import httpService from '@/lib/http-service';
import { User, CreateUserDto, UpdateUserDto } from '@/types';
import { API_CONFIG } from '@/constants/constants';

export const userService = {
  async findAll(): Promise<User[]> {
    const response = await httpService.get<User[]>(API_CONFIG.path.users);
    return response.data;
  },

  async findOne(id: string): Promise<User> {
    const response = await httpService.get<User>(`${API_CONFIG.path.users}/${id}`);
    return response.data;
  },

  async create(data: CreateUserDto): Promise<User> {
    const response = await httpService.post<User>(API_CONFIG.path.users, data);
    return response.data;
  },

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const response = await httpService.patch<User>(`${API_CONFIG.path.users}/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`${API_CONFIG.path.users}/${id}`);
  },
};
