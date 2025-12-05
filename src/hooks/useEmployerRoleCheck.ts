import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';

export const useEmployerRoleCheck = (user: User | undefined) => {
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== UserRole.employer) {
      router.push(FRONTEND_ROUTES.JOBS.BASE);
    }
  }, [user, router]);

  const isEmployer = user?.role === UserRole.employer;
  const isLoading = !user;

  return { isEmployer, isLoading };
};
