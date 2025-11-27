'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AUTH_TOKEN_KEY, API_CONFIG } from '@/constants/constants';
import { useToast } from '@/hooks/use-toast';
import httpService from '@/lib/http-service';
import { getDashboardRoute } from '@/lib/dashboard-routes';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        
        try {
          // Fetch user info to determine role-based redirect
          const { data: user } = await httpService.get<{ role: string }>(API_CONFIG.path.userAuth.me);
          
          toast({
            title: 'Login successful',
            description: 'Welcome to MedBridge',
          });
          
          // Redirect to role-specific dashboard
          const dashboardRoute = getDashboardRoute(user.role);
          router.push(dashboardRoute);
        } catch (error) {
          toast({
            title: 'Authentication failed',
            description: 'Failed to fetch user information',
            variant: 'destructive',
          });
          router.push('/auth/login');
        }
      } else {
        toast({
          title: 'Authentication failed',
          description: 'No token received from authentication provider',
          variant: 'destructive',
        });
        
        router.push('/auth/login');
      }
    };
    
    handleCallback();
  }, [searchParams, router, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we sign you in</p>
      </div>
    </div>
  );
}
