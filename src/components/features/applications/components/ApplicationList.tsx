
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationEmptyState } from './ApplicationEmptyState';
import { ApplicationStatus, Application, Job } from '@/types';

interface ApplicationListProps {
    isLoading: boolean;
    filteredApplications: Application[];
    allApplicationsCount: number;
    jobs: Job[];
    onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
    onClearFilters: () => void;
}

export function ApplicationList({
    isLoading,
    filteredApplications,
    allApplicationsCount,
    jobs,
    onStatusChange,
    onClearFilters
}: ApplicationListProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-48" />
                ))}
            </div>
        );
    }

    if (filteredApplications.length === 0) {
        return (
            <ApplicationEmptyState
                hasApplications={allApplicationsCount > 0}
                onClearFilters={onClearFilters}
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                {filteredApplications.map((application) => {
                    const job = jobs.find(j => j.id === application.jobId);
                    const candidate = application.candidateProfile;

                    return (
                        <ApplicationCard
                            key={application.id}
                            application={application}
                            job={job}
                            candidate={candidate}
                            onStatusChange={onStatusChange}
                        />
                    );
                })}
            </div>

        </div>
    );
}
