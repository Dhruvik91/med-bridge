'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { JobSwipeCard } from '@/components/ui/job-swipe-card';
import { Job } from '@/types';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCreateApplication } from '@/hooks/post/useCreateApplication';
import { useAuth } from '@/providers/auth-provider';
import { toast } from 'sonner';

interface JobFeedSwipeProps {
  jobs: Job[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function JobFeedSwipe({ jobs, onRefresh, isLoading }: JobFeedSwipeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const createApplication = useCreateApplication();

  const currentJob = jobs[currentIndex];

  const handleSwipeLeft = () => {
    setDirection('left');
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setDirection(null);
    }, 300);
  };

  const handleSwipeRight = async () => {
    if (!user?.id || !currentJob) return;

    try {
      await createApplication.mutateAsync({
        jobId: currentJob.id,
        candidateId: user.id,
      });
      toast.success('Application submitted successfully!');
      setDirection('right');
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setDirection(null);
      }, 300);
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  const handleTap = () => {
    if (currentJob) {
      router.push(`/jobs/${currentJob.id}`);
    }
  };

  if (currentIndex >= jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-8">
        <Sparkles className="h-16 w-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">You've seen all available jobs!</h2>
        <p className="text-muted-foreground mb-6">
          Check back later for new opportunities or adjust your preferences.
        </p>
        {onRefresh && (
          <Button onClick={onRefresh} size="lg" className="gap-2">
            <RefreshCw className="h-5 w-5" />
            Refresh Feed
          </Button>
        )}
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <p className="text-muted-foreground">No jobs available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative h-[600px]">
        <AnimatePresence>
          {currentJob && (
            <JobSwipeCard
              key={currentJob.id}
              job={currentJob}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onTap={handleTap}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {currentIndex + 1} of {jobs.length} jobs
        </p>
      </div>
    </div>
  );
}
