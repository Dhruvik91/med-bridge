import httpService from '@/lib/http-service';
import { SignupDto, LoginDto, AuthResponse, User } from '@/types';
import { API_CONFIG } from '@/constants/constants';

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface MessageResponse {
  message: string;
}

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

  async forgotPassword(data: ForgotPasswordDto): Promise<MessageResponse> {
    const response = await httpService.post<MessageResponse>(API_CONFIG.path.userAuth.forgotPassword, data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordDto): Promise<MessageResponse> {
    const response = await httpService.post<MessageResponse>(API_CONFIG.path.userAuth.resetPassword, data);
    return response.data;
  },
};
