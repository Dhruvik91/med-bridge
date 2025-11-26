'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AUTH_TOKEN_KEY } from '@/constants/constants';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      
      toast({
        title: 'Login successful',
        description: 'Welcome to MedBridge',
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      toast({
        title: 'Authentication failed',
        description: 'No token received from authentication provider',
        variant: 'destructive',
      });
      
      router.push('/auth/login');
    }
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
