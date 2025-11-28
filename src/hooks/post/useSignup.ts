import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';
import { SignupDto, UserRole } from '@/types';
import { AUTH_TOKEN_KEY, FRONTEND_ROUTES } from '@/constants/constants';

export const useSignup = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: SignupDto) => authService.signup(data),
    onSuccess: (response, variables) => {
      toast({
        title: 'Account created successfully',
        description: 'Welcome to MedBridge! Please complete your profile.',
      });
      
      if (response.access_token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
        
        // Redirect to profile completion based on role
        if (variables.role === UserRole.candidate) {
          router.push(FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE);
        } else {
          router.push(FRONTEND_ROUTES.PROFILE.EMPLOYER.COMPLETE);
        }
      } else {
        router.push('/auth/login');
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Signup failed',
        description: error.response?.data?.message || 'Failed to create account',
        variant: 'destructive',
      });
    },
  });
};
