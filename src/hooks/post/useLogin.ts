import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';
import { AUTH_TOKEN_KEY, FRONTEND_ROUTES } from '@/constants/constants';
import { LoginDto, UserRole } from '@/types';

export const useLogin = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (response) => {
      localStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back to MedBridge',
      });
      
      // Redirect based on role
      if (response.user.role === UserRole.candidate) {
        router.push(FRONTEND_ROUTES.DASHBOARD.CANDIDATE);
      } else if (response.user.role === UserRole.employer) {
        router.push(FRONTEND_ROUTES.DASHBOARD.EMPLOYER);
      } else {
        router.push(FRONTEND_ROUTES.DASHBOARD.BASE);
      }
    },
    onError: (error: any) => {
      // Error handling is done in the component
      throw error;
    },
  });
};
