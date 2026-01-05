'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { jobService } from '@/services/job.service';

export const useInfiniteJobsByEmployer = (employerProfileId: string, limit = 20) => {
    return useInfiniteQuery({
        queryKey: ['employerJobs', 'infinite', employerProfileId, limit],
        enabled: !!employerProfileId,
        initialPageParam: 1,
        queryFn: ({ pageParam }) => jobService.findByEmployer(employerProfileId, pageParam, limit),
        getNextPageParam: (lastPage) => {
            if (!lastPage) return undefined;
            const nextPage = lastPage.page + 1;
            const hasMore = lastPage.page * lastPage.limit < lastPage.total;
            return hasMore ? nextPage : undefined;
        },
    });
};
