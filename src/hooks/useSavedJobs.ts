import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/auth-provider';
import { savedJobService } from '@/services/saved-job.service';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';

export const useSavedJobs = () => {
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

  // Fetch saved jobs
  const { data: savedJobs = [], isLoading: savedJobsLoading } = useQuery({
    queryKey: ['savedJobs', user?.id],
    queryFn: () => savedJobService.findByUser(user!.id),
    enabled: !!user?.id,
  });

  // Unsave job mutation
  const unsaveJobMutation = useMutation({
    mutationFn: ({ jobId }: { jobId: string }) => savedJobService.unsave(user!.id, jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
      toast({
        title: 'Job removed',
        description: 'Job has been removed from your saved jobs',
      });
      setDeletingJobId(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove saved job',
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
