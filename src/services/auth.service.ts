import httpService from '@/lib/http-service';
import { SignupDto, LoginDto, AuthResponse, User } from '@/types';
import { API_CONFIG } from '@/constants/constants';

export const authService = {
  async signup(data: SignupDto): Promise<AuthResponse> {
    const response = await httpService.post<AuthResponse>(API_CONFIG.path.userAuth.signup, data);
    return response.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await httpService.post<AuthResponse>(API_CONFIG.path.userAuth.login, data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await httpService.get<User>(API_CONFIG.path.userAuth.me);
    return response.data;
  },

  googleAuth(): string {
    return `${API_CONFIG.baseUrl}${API_CONFIG.path.userAuth.googleLogin}`;
  },
};
