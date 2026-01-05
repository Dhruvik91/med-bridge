import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/auth-provider';
import { savedJobService } from '@/services/saved-job.service';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import { JobFilters } from '@/components/features/jobs/hooks/useJobFilters';

export const useInfiniteSavedJobs = (filters?: JobFilters, limit = 20) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

    const { profile, loading } = useAuth();

    const user: User | undefined = profile
        ? {
              id: profile.id,
              email: profile.email,
              role: profile.role,
              isEmailVerified: profile.isVerified,
              isGoogleSignup: false,
              createdAt: profile.createdAt,
              updatedAt: profile.updatedAt,
          }
        : undefined;

    const savedJobsQuery = useInfiniteQuery({
        queryKey: ['savedJobs', 'infinite', user?.id, filters, limit],
        enabled: !!user?.id,
        initialPageParam: 1,
        queryFn: ({ pageParam }) => {
            const params: Record<string, any> = {
                page: pageParam,
                limit,
            };

            if (filters) {
                if (filters.searchQuery) params.q = filters.searchQuery;
                if (filters.location) params.location = filters.location;
                if (filters.jobType && filters.jobType !== 'all') params.jobType = filters.jobType;
                if (filters.salaryMin !== '') params.salaryMin = filters.salaryMin;
                if (filters.salaryMax !== '') params.salaryMax = filters.salaryMax;
                if (filters.experienceMin !== '') params.experienceMin = filters.experienceMin;
                if (filters.experienceMax !== '') params.experienceMax = filters.experienceMax;
                if (filters.specialtyIds && filters.specialtyIds.length > 0) {
                    params.specialtyIds = filters.specialtyIds;
                }
                if (filters.postedWithin && filters.postedWithin !== 'all') {
                    params.postedWithin = filters.postedWithin;
                }
            }

            return savedJobService.findByUser(user!.id, params);
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage) return undefined;
            const nextPage = lastPage.page + 1;
            const hasMore = lastPage.page * lastPage.limit < lastPage.total;
            return hasMore ? nextPage : undefined;
        },
        refetchOnMount: 'always',
        refetchOnWindowFocus: 'always',
    });

    const unsaveJobMutation = useMutation({
        mutationFn: ({ jobId }: { jobId: string }) => savedJobService.unsave(user!.id, jobId),
        onSuccess: (_data, variables) => {
            const { jobId } = variables;

            queryClient.setQueriesData({ queryKey: ['savedJobs'] }, (oldData: any) => {
                if (!oldData) return oldData;

                if (Array.isArray(oldData)) {
                    return oldData.filter((savedJob) => savedJob.job?.id !== jobId);
                }

                if (oldData.pages && Array.isArray(oldData.pages)) {
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => {
                            if (!page?.items || !Array.isArray(page.items)) return page;
                            return {
                                ...page,
                                items: page.items.filter((savedJob: any) => savedJob.job?.id !== jobId),
                            };
                        }),
                    };
                }

                if (Array.isArray(oldData.items)) {
                    return {
                        ...oldData,
                        items: oldData.items.filter((savedJob: any) => savedJob.job?.id !== jobId),
                    };
                }

                return oldData;
            });

            queryClient.invalidateQueries({ queryKey: ['savedJobs'] });

            toast({
                title: 'Job removed',
                description: 'Job has been removed from your saved jobs',
            });
            setDeletingJobId(null);
        },
        onError: (error: any) => {
            toast({
                title: error.response?.data?.message?.[0] || 'Failed to remove saved job',
                description: error.response?.data?.message || 'Failed to remove saved job',
                variant: 'destructive',
            });
            setDeletingJobId(null);
        },
    });

    const handleUnsaveJob = (jobId: string) => {
        setDeletingJobId(jobId);
        unsaveJobMutation.mutate({ jobId });
    };

    return {
        user,
        userLoading: loading,
        deletingJobId,
        handleUnsaveJob,
        ...savedJobsQuery,
    };
};
