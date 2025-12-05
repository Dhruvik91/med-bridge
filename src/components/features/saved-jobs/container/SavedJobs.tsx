'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { useJobFormatters } from '@/hooks/useJobFormatters';
import { SavedJobsHeader } from '../components/SavedJobsHeader';
import { SavedJobsGrid } from '../components/SavedJobsGrid';
import { SavedJobsLoading } from '../components/SavedJobsLoading';
import { SavedJobsUnauthenticated } from '../components/SavedJobsUnauthenticated';
import { SavedJobsEmptyState } from '../components/SavedJobsEmptyState';
import { SavedJobCard } from '../components/SavedJobCard';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function SavedJobs() {
    const {
        user,
        userLoading,
        savedJobs,
        savedJobsLoading,
        deletingJobId,
        handleUnsaveJob,
    } = useSavedJobs();

    const { formatSalary, getJobTypeLabel, formatDate } = useJobFormatters();

    // Loading state
    if (userLoading || savedJobsLoading) {
        return <SavedJobsLoading />;
    }

    // Unauthenticated state
    if (!user) {
        return <SavedJobsUnauthenticated />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <SavedJobsHeader count={savedJobs.length} />

            {/* Empty State */}
            {savedJobs.length === 0 ? (
                <SavedJobsEmptyState />
            ) : (
                <>
                    {/* Saved Jobs Grid */}
                    <SavedJobsGrid>
                        {savedJobs.map((savedJob) => (
                            <SavedJobCard
                                key={savedJob.id}
                                savedJob={savedJob}
                                onUnsave={handleUnsaveJob}
                                isDeleting={deletingJobId === savedJob.job?.id}
                                formatSalary={formatSalary}
                                getJobTypeLabel={getJobTypeLabel}
                                formatDate={formatDate}
                            />
                        ))}
                    </SavedJobsGrid>

                    {/* Back to Dashboard Link */}
                    <div className="mt-8 text-center">
                        <Button variant="outline" asChild>
                            <Link href={`${FRONTEND_ROUTES.DASHBOARD.CANDIDATE}`}>Back to Dashboard</Link>
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
