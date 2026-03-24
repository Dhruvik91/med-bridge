'use client';

import { useGetJobs } from '@/hooks/get/useGetJobs';
import { JobFeedSwipe } from '@/components/features/jobs/job-feed-swipe';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function FeedPage() {
  const { data: jobsData, isLoading, refetch } = useGetJobs({ page: 1, take: 50 });

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto mb-2" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="max-w-md mx-auto">
          <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const jobs = jobsData?.items || [];

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Job Feed</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Swipe right to apply, left to skip, or tap for details
        </p>
      </div>

      {jobs.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">No Jobs Available</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Check back later for new opportunities or update your preferences.
          </CardContent>
        </Card>
      ) : (
        <JobFeedSwipe jobs={jobs} onRefresh={() => refetch()} isLoading={isLoading} />
      )}
    </div>
  );
}
