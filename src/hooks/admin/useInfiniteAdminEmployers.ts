'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { adminService, AdminUsersQuery } from '@/services/admin.service';

export const useInfiniteAdminEmployers = (params: AdminUsersQuery = {}, limit = 20) => {
  return useInfiniteQuery({
    queryKey: ['admin', 'employers', 'infinite', params, limit],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => adminService.findAllEmployers({ ...params, page: pageParam, limit }),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const nextPage = lastPage.page + 1;
      const hasMore = lastPage.page * lastPage.limit < lastPage.total;
      return hasMore ? nextPage : undefined;
    },
  });
};
