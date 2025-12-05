'use client';

import { useParams } from 'next/navigation';
import { JobFormContainer } from '@/components/features/jobs/container/JobFormContainer';
import { useGetJob } from '@/hooks/get/useGetJob';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const { data: job, isLoading, error } = useGetJob(jobId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        <Card className="text-center py-16">
          <CardHeader>
            <CardTitle>Job Not Found</CardTitle>
            <CardDescription>
              The job you're looking for doesn't exist or you don't have permission to edit it.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => router.push('/jobs/manage')}>
              Back to Manage Jobs
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <JobFormContainer mode="edit" existingJob={job} />;
}
