'use client';

import { useState } from 'react';
import { useGetApplications } from '@/hooks/get/useGetApplications';
import { useUpdateApplicationStatus } from '@/hooks/update/useUpdateApplicationStatus';
import { ApplicationKanban } from '@/components/features/applications/application-kanban';
import { Skeleton } from '@/components/ui/skeleton';
import { ApplicationStatus } from '@/types';
import { Briefcase } from 'lucide-react';

export default function EmployerApplicationsPage() {
  const { data: applications, isLoading, refetch } = useGetApplications();
  const updateStatus = useUpdateApplicationStatus();

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await updateStatus.mutateAsync({
        id: applicationId,
        data: { status: newStatus },
      });
      refetch();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-96 w-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Application Management</h1>
          <p className="text-muted-foreground">Manage and track all job applications</p>
        </div>
      </div>

      <ApplicationKanban
        applications={applications?.items || []}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
