import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/auth-provider';
import { savedJobService } from '@/services/saved-job.service';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import { JobFilters } from '@/components/features/jobs/hooks/useJobFilters';

export const useSavedJobs = (filters?: JobFilters) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const { user: authUser, profile, loading } = useAuth();

  // Map UserProfile to User type to maintain compatibility
  const user: User | undefined = profile ? {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    isEmailVerified: profile.isVerified,
    isGoogleSignup: false,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  } : undefined;

  // Fetch saved jobs (paginated) with optional filters, and unwrap items
  const { data: savedJobsData, isLoading: savedJobsLoading } = useQuery({
    queryKey: ['savedJobs', user?.id, filters],
    queryFn: () => {
      const params: Record<string, any> = {
        page: 1,
        limit: 50,
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
    enabled: !!user?.id,
    // Ensure we always refetch when a component using this hook mounts
    // so pages like Saved Jobs see the latest server state after saves.
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
  });

  const savedJobs = (savedJobsData?.items ?? []).filter(
    (savedJob) => savedJob.job && !savedJob.job.deletedAt
  );

  // Unsave job mutation
  const unsaveJobMutation = useMutation({
    mutationFn: ({ jobId }: { jobId: string }) => savedJobService.unsave(user!.id, jobId),
    onSuccess: (_data, variables) => {
      const { jobId } = variables;

      // Optimistically remove the job from all savedJobs query caches
      queryClient.setQueriesData(
        { queryKey: ['savedJobs'] },
        (oldData: any) => {
          if (!oldData) return oldData;

          // Handle both paginated (with items) and simple array shapes safely
          if (Array.isArray(oldData)) {
            return oldData.filter((savedJob) => savedJob.job?.id !== jobId);
          }

          if (Array.isArray(oldData.items)) {
            return {
              ...oldData,
              items: oldData.items.filter((savedJob: any) => savedJob.job?.id !== jobId),
            };
          }

          return oldData;
        }
      );

      // Also trigger a refetch for any components that rely on server state
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });

      toast({
        title: 'Job removed',
        description: 'Job has been removed from your saved jobs',
      });
      setDeletingJobId(null);
    },
    onError: (error: any) => {
      toast({
        title: error.response?.data?.message[0] || 'Failed to remove saved job',
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
    savedJobs,
    savedJobsLoading,
    deletingJobId,
    handleUnsaveJob,
  };
};
