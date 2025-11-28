import { authService } from '@/services/auth.service';

export const useGoogleAuth = () => {
  const handleGoogleLogin = () => {
    window.location.href = authService.googleAuth();
  };

  return { handleGoogleLogin };
};
