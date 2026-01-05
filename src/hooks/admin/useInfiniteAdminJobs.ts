'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { adminService, AdminJobsQuery } from '@/services/admin.service';

export const useInfiniteAdminJobs = (params: AdminJobsQuery = {}, limit = 20) => {
  return useInfiniteQuery({
    queryKey: ['admin', 'jobs', 'infinite', params, limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => adminService.findAllJobs({ ...params, page: pageParam, limit }),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const nextPage = lastPage.page + 1;
      const hasMore = lastPage.page * lastPage.limit < lastPage.total;
      return hasMore ? nextPage : undefined;
    },
  });
};
