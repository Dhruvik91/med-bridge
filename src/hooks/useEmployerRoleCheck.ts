import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/types';

export const useEmployerRoleCheck = (user: User | undefined) => {
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== UserRole.employer) {
      router.push('/jobs');
    }
  }, [user, router]);

  const isEmployer = user?.role === UserRole.employer;
  const isLoading = !user;

  return { isEmployer, isLoading };
};
