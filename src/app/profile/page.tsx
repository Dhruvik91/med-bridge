'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Navigation } from '@/components/navigation';
import { authService } from '@/services/auth.service';

export default function ProfileRedirectPage() {
  const router = useRouter();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getMe,
  });

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      if (user.role === 'candidate') {
        router.replace('/profile/doctor/edit');
      } else if (user.role === 'employer') {
        router.replace('/profile/employer/edit');
      } else {
        router.replace('/dashboard');
      }
    } else if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, isLoading, router]);

  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </main>
    </>
  );
}
