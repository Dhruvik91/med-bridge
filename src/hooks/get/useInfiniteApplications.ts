'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { applicationService } from '@/services/application.service';

export const useInfiniteApplicationsByCandidate = (candidateId: string, limit = 20) => {
    return useInfiniteQuery({
        queryKey: ['candidateApplications', 'infinite', candidateId, limit],
        enabled: !!candidateId,
        initialPageParam: 1,
        queryFn: ({ pageParam }) => applicationService.findByCandidate(candidateId, pageParam, limit),
        getNextPageParam: (lastPage) => {
            if (!lastPage) return undefined;
            const nextPage = lastPage.page + 1;
            const hasMore = lastPage.page * lastPage.limit < lastPage.total;
            return hasMore ? nextPage : undefined;
        },
    });
};

export const useInfiniteApplications = (limit = 20) => {
    return useInfiniteQuery({
        queryKey: ['allApplications', 'infinite', limit],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => applicationService.findAll(pageParam, limit),
        getNextPageParam: (lastPage) => {
            if (!lastPage) return undefined;
            const nextPage = lastPage.page + 1;
            const hasMore = lastPage.page * lastPage.limit < lastPage.total;
            return hasMore ? nextPage : undefined;
        },
    });
};
