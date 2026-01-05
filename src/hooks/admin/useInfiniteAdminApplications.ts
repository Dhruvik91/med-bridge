'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { adminService, AdminApplicationsQuery } from '@/services/admin.service';

export const useInfiniteAdminApplications = (params: AdminApplicationsQuery = {}, limit = 20) => {
  return useInfiniteQuery({
    queryKey: ['admin', 'applications', 'infinite', params, limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => adminService.findAllApplications({ ...params, page: pageParam, limit }),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const nextPage = lastPage.page + 1;
      const hasMore = lastPage.page * lastPage.limit < lastPage.total;
      return hasMore ? nextPage : undefined;
    },
  });
};
