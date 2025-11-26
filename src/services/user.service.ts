import httpService from '@/lib/http-service';
import { User, CreateUserDto, UpdateUserDto } from '@/types';

export const userService = {
  async findAll(): Promise<User[]> {
    const response = await httpService.get<User[]>('/users');
    return response.data;
  },

  async findOne(id: string): Promise<User> {
    const response = await httpService.get<User>(`/users/${id}`);
    return response.data;
  },

  async create(data: CreateUserDto): Promise<User> {
    const response = await httpService.post<User>('/users', data);
    return response.data;
  },

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const response = await httpService.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await httpService.delete(`/users/${id}`);
  },
};
