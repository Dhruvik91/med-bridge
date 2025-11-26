import httpService from '@/lib/http-service';
import { SignupDto, LoginDto, AuthResponse, User } from '@/types';

export const authService = {
  async signup(data: SignupDto): Promise<AuthResponse> {
    const response = await httpService.post<AuthResponse>('/user-auth/signup', data);
    return response.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await httpService.post<AuthResponse>('/user-auth/login', data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await httpService.get<User>('/user-auth/me');
    return response.data;
  },

  googleAuth(): string {
    return `${process.env.NEXT_PUBLIC_API_URL}/user-auth/google`;
  },
};
