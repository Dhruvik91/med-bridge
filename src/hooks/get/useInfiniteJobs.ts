'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { jobService } from '@/services/job.service';

export const useInfiniteJobs = (params: Record<string, any> = {}, limit = 20) => {
    return useInfiniteQuery({
        queryKey: ['jobs', 'infinite', params, limit],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => jobService.findAll({ ...params, page: pageParam, limit }),
        getNextPageParam: (lastPage) => {
            if (!lastPage) return undefined;
            const nextPage = lastPage.page + 1;
            const hasMore = lastPage.page * lastPage.limit < lastPage.total;
            return hasMore ? nextPage : undefined;
        },
    });
};
