'use client';

import { useGetApplicationsByCandidate } from '@/hooks/get/useGetApplications';
import { ApplicationTimeline } from '@/components/features/applications/application-timeline';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/providers/auth-provider';
import { ClipboardList } from 'lucide-react';

export default function ApplicationTrackPage() {
  const { user } = useAuth();
  const { data: applications, isLoading } = useGetApplicationsByCandidate(user?.id || '');

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardList className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Application Tracker</h1>
          <p className="text-muted-foreground">Monitor your application progress</p>
        </div>
      </div>

      <ApplicationTimeline applications={applications?.items || []} />
    </div>
  );
}
