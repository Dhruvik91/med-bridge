'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Briefcase, Plus, CheckCircle, FileText, XCircle, Archive } from 'lucide-react';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useGetJobsByEmployer } from '@/hooks/get/useGetJobsByEmployer';
import { useDeleteJob } from '@/hooks/delete/useDeleteJob';
import { useJobFormatters } from '@/hooks/useJobFormatters';
import { JobStatus, UserRole } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { NotAuthorizedUser } from '@/components/NotAuthorized';
import { JobStats } from '../components/JobStats';
import { ManageJobsFilters } from '../components/ManageJobsFilters';
import { JobCard } from '../components/JobCard';
import { EmptyState } from '../components/EmptyState';

const getStatusColor = (status: JobStatus) => {
    switch (status) {
        case JobStatus.published:
            return 'bg-green-500/10 text-green-600 hover:bg-green-500/20';
        case JobStatus.draft:
            return 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20';
        case JobStatus.closed:
            return 'bg-red-500/10 text-red-600 hover:bg-red-500/20';
        case JobStatus.archived:
            return 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20';
        default:
            return 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20';
    }
};

const getStatusIcon = (status: JobStatus) => {
    switch (status) {
        case JobStatus.published:
            return <CheckCircle className="h-4 w-4" />;
        case JobStatus.draft:
            return <FileText className="h-4 w-4" />;
        case JobStatus.closed:
            return <XCircle className="h-4 w-4" />;
        case JobStatus.archived:
            return <Archive className="h-4 w-4" />;
        default:
            return <FileText className="h-4 w-4" />;
    }
};

export const JobsManage = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
    const [jobToDelete, setJobToDelete] = useState<string | null>(null);

    const { data: user } = useGetMe();
    const { data: employerProfile } = useGetEmployerProfile(user);
    const { data: jobs = [], isLoading } = useGetJobsByEmployer(employerProfile?.id || '');
    const { formatSalary, getJobTypeLabel } = useJobFormatters();
    const deleteJobMutation = useDeleteJob();

    // Redirect non-employers
    useEffect(() => {
        if (user && user.role !== UserRole.employer) {
            router.push(FRONTEND_ROUTES.JOBS.BASE);
        }
    }, [user, router]);

    const filteredJobs = useMemo(() => {
        let filtered = [...jobs];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (job) =>
                    job.title.toLowerCase().includes(query) ||
                    job.description.toLowerCase().includes(query) ||
                    job.specialties?.some((s) => s.name.toLowerCase().includes(query))
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((job) => job.status === statusFilter);
        }

        return filtered;
    }, [jobs, searchQuery, statusFilter]);

    const stats = useMemo(() => {
        const total = jobs.length;
        const published = jobs.filter((j) => j.status === JobStatus.published).length;
        const draft = jobs.filter((j) => j.status === JobStatus.draft).length;
        const closed = jobs.filter((j) => j.status === JobStatus.closed).length;

        return { total, published, draft, closed };
    }, [jobs]);

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setStatusFilter('all');
    }, []);

    const handleDeleteJob = (jobId: string) => {
        deleteJobMutation.mutate(jobId);
        setJobToDelete(null);
    };

    if (!user || user.role !== UserRole.employer) {
        return <NotAuthorizedUser userType={UserRole.employer} />;
    }

    const showClearButton = !!(searchQuery || statusFilter !== 'all');

    return (
        <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Manage Job Postings</h1>
                        <p className="text-base text-muted-foreground">
                            View and manage all your job listings
                        </p>
                    </div>
                    <Button asChild size="lg" className="w-full md:w-auto">
                        <Link href={FRONTEND_ROUTES.JOBS.CREATE}>
                            <Plus className="mr-2 h-4 w-4" />
                            Post New Job
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <JobStats
                    total={stats.total}
                    published={stats.published}
                    draft={stats.draft}
                    closed={stats.closed}
                />
            </div>

            {/* Search and Filters */}
            <ManageJobsFilters
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                onSearchChange={setSearchQuery}
                onStatusFilterChange={setStatusFilter}
                onClearFilters={handleClearFilters}
                showClearButton={showClearButton}
            />

            {/* Job Listings */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            ) : filteredJobs.length === 0 ? (
                <EmptyState
                    icon={Briefcase}
                    title={jobs.length === 0 ? 'No jobs posted yet' : 'No jobs found'}
                    description={
                        jobs.length === 0
                            ? 'Get started by creating your first job posting to attract top medical talent'
                            : 'Try adjusting your search criteria or clearing filters to see more results'
                    }
                    actionLabel={jobs.length === 0 ? 'Post Your First Job' : 'Clear Filters'}
                    onAction={jobs.length === 0 ? () => router.push(FRONTEND_ROUTES.JOBS.CREATE) : handleClearFilters}
                />
            ) : (
                <div className="space-y-6">
                    {filteredJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            userRole={user?.role}
                            variant="manage"
                            formatSalary={formatSalary}
                            getJobTypeLabel={(type: string) => getJobTypeLabel(type as any)}
                            formatDate={(date) => new Date(date).toLocaleDateString()}
                            onDelete={setJobToDelete}
                            getStatusColor={(status: string) => getStatusColor(status as JobStatus)}
                            getStatusIcon={(status: string) => getStatusIcon(status as JobStatus)}
                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader className="space-y-3">
                        <AlertDialogTitle className="text-lg font-semibold">Delete Job Posting?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed">
                            This action cannot be undone. This will permanently delete the job posting and all
                            associated data including applications and analytics.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-3">
                        <AlertDialogCancel className="font-medium">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => jobToDelete && handleDeleteJob(jobToDelete)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium"
                        >
                            Delete Job
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
