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
import { Briefcase, Plus, CheckCircle, FileText, XCircle, Archive, Eye, Trash2 } from 'lucide-react';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useInfiniteJobsByEmployer } from '@/hooks/get/useInfiniteJobsByEmployer';
import { useDeleteJob } from '@/hooks/delete/useDeleteJob';
import { useJobFormatters } from '@/hooks/useJobFormatters';
import { JobStatus, UserRole } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { NotAuthorizedUser } from '@/components/NotAuthorized';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { JobStats } from '../components/JobStats';
import { ManageJobsFilters } from '../components/ManageJobsFilters';
import { JobCard } from '../components/JobCard';
import { EmptyState } from '../components/EmptyState';
import { JobsManageSkeleton } from '../components/JobsManageSkeleton';
import { MobileJobStatsDrawer } from '../components/MobileJobStatsDrawer';
import { MobileJobFilterDrawer } from '../components/MobileJobFilterDrawer';

const getStatusColor = (status: JobStatus) => {
    switch (status) {
        case JobStatus.published:
            return 'bg-primary/10 text-foreground hover:bg-primary/15';
        case JobStatus.draft:
            return 'bg-accent text-accent-foreground hover:bg-accent/80';
        case JobStatus.closed:
            return 'bg-destructive/10 text-destructive hover:bg-destructive/15';
        case JobStatus.archived:
            return 'bg-muted text-muted-foreground hover:bg-muted/80';
        default:
            return 'bg-muted text-muted-foreground hover:bg-muted/80';
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
    const { data: employerProfile, isLoading: isLoadingEmployerProfile } = useGetEmployerProfile(user);
    const {
        data: jobsData,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
    } = useInfiniteJobsByEmployer(employerProfile?.id || '', 20);
    const { formatSalary, getJobTypeLabel } = useJobFormatters();
    const deleteJobMutation = useDeleteJob();

    // Redirect non-employers
    useEffect(() => {
        if (user && user.role !== UserRole.employer) {
            router.push(FRONTEND_ROUTES.JOBS.BASE);
        }
    }, [user, router]);

    const jobs = useMemo(() => jobsData?.pages.flatMap((p) => p.items) ?? [], [jobsData]);
    const total = jobsData?.pages?.[0]?.total ?? 0;

    const { sentinelRef } = useInfiniteScroll({
        root: null,
        rootMargin: '400px',
        threshold: 0,
        hasNextPage,
        isFetchingNextPage,
        onLoadMore: fetchNextPage,
    });

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

    if (isLoading || isLoadingEmployerProfile || !user) {
        return <JobsManageSkeleton />;
    }

    if (user.role !== UserRole.employer) {
        return <NotAuthorizedUser userType={user.role} />;
    }

    const showClearButton = !!(searchQuery || statusFilter !== 'all');

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Fixed Header - Sticky on Desktop */}
            <div className="sticky top-0 z-10 glass-enhanced border-b">
                <div className="container mx-auto px-4 py-4 md:py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:mb-0">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Manage Job Postings</h1>
                                <p className="text-sm md:text-base text-muted-foreground">
                                    {total > 0 ? (
                                        <>
                                            Showing {filteredJobs.length} of {total} {total === 1 ? 'job' : 'jobs'}
                                        </>
                                    ) : (
                                        <>
                                            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                                        </>
                                    )}
                                </p>
                            </div>
                            {/* Mobile Buttons */}
                            <div className='flex gap-2 md:hidden'>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={FRONTEND_ROUTES.JOBS.BASE}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <MobileJobStatsDrawer stats={stats} />
                                <MobileJobFilterDrawer
                                    searchQuery={searchQuery}
                                    statusFilter={statusFilter}
                                    onSearchChange={setSearchQuery}
                                    onStatusFilterChange={setStatusFilter}
                                    onClearFilters={handleClearFilters}
                                    showClearButton={showClearButton}
                                />
                            </div>
                        </div>

                        <div className='flex gap-2'>
                            <Button asChild variant="outline" size="lg" className="w-full md:w-auto hidden md:flex">
                                <Link href={FRONTEND_ROUTES.JOBS.BASE}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Jobs
                                </Link>
                            </Button>

                            <Button asChild size="lg" className="w-full md:w-auto hidden md:flex">
                                <Link href={FRONTEND_ROUTES.JOBS.CREATE}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Post New Job
                                </Link>
                            </Button>
                        </div>

                    </div>

                    {/* Stats - Desktop Only */}
                    <div className="hidden md:block mt-4">
                        <JobStats
                            total={stats.total}
                            published={stats.published}
                            draft={stats.draft}
                            closed={stats.closed}
                        />
                    </div>

                    {/* Filters - Desktop Only */}
                    <div className="hidden md:block mt-3">
                        <ManageJobsFilters
                            searchQuery={searchQuery}
                            statusFilter={statusFilter}
                            onSearchChange={setSearchQuery}
                            onStatusFilterChange={setStatusFilter}
                            onClearFilters={handleClearFilters}
                            showClearButton={showClearButton}
                        />
                    </div>

                </div>
            </div>

            {/* Scrollable Job Listings */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 py-6">
                    {isError ? (
                        <EmptyState
                            icon={Briefcase}
                            title="Something went wrong"
                            description="We couldn't load your jobs right now. Please try again."
                        />
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
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
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

                            <div ref={sentinelRef} className="h-8" />

                            {isFetchingNextPage && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <Skeleton key={i} className="h-64" />
                                    ))}
                                </div>
                            )}

                            {!hasNextPage && total > 0 && jobs.length >= total && (
                                <div className="mt-6 text-center text-sm text-muted-foreground">
                                    You've reached the end.
                                </div>
                            )}
                        </>
                    )}

                    {/* Delete Confirmation Dialog */}
                    <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
                        <AlertDialogContent className="max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
                            <div className="p-6 pt-8 flex flex-col items-center text-center">
                                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                                    <Trash2 className="h-6 w-6 text-destructive" />
                                </div>
                                <AlertDialogHeader className="space-y-2">
                                    <AlertDialogTitle className="text-xl font-bold tracking-tight">
                                        Delete Job Posting?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed px-2">
                                        This action cannot be undone. This will permanently delete the job posting and all
                                        associated data.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                            </div>
                            <div className="p-4 bg-muted/30 border-t border-border flex flex-col gap-2">
                                <AlertDialogAction
                                    onClick={() => jobToDelete && handleDeleteJob(jobToDelete)}
                                    className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 h-11 font-semibold tap-scale"
                                >
                                    Delete Job
                                </AlertDialogAction>
                                <AlertDialogCancel className="w-full h-11 font-medium bg-background border-border/50 hover:bg-accent tap-scale outline-none ring-0 focus:ring-0">
                                    Cancel
                                </AlertDialogCancel>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
};
