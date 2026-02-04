'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useGetJobsByEmployer } from '@/hooks/get/useGetJobsByEmployer';
import { useInfiniteApplications } from '@/hooks/get/useInfiniteApplications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/services/application.service';
import { useToast } from '@/hooks/use-toast';
import { ApplicationStatus, UserRole, Job, Application } from '@/types';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ApplicationStats } from '../components/ApplicationStats';

import { ApplicationList } from '../components/ApplicationList';
import { MobileApplicationStatsDrawer } from '../components/MobileApplicationStatsDrawer';
import { MobileApplicationFilterDrawer } from '../components/MobileApplicationFilterDrawer';
import { DesktopApplicationFilterDrawer } from '../components/DesktopApplicationFilterDrawer';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { NotAuthorizedUser } from '@/components/NotAuthorized';

export function ManageApplications() {
    const searchParams = useSearchParams();
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
    const [jobFilter, setJobFilter] = useState<string>(searchParams.get('jobId') || 'all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

    useEffect(() => {
        const jobId = searchParams.get('jobId');
        if (jobId) {
            setJobFilter(jobId);
        }
    }, [searchParams]);

    // Fetch current user
    const { data: user, isLoading: userLoading } = useGetMe();

    // Fetch employer profile
    const { data: profile, isLoading: profileLoading } = useGetEmployerProfile(user);

    // Fetch employer's jobs
    const { data: jobsData, isLoading: jobsLoading } = useGetJobsByEmployer(profile?.id || '');

    const {
        data,
        isLoading: applicationsLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
    } = useInfiniteApplications(20);

    // Derived jobs array from paginated result
    const jobs: Job[] = (jobsData as any)?.items ?? [];

    // Derived applications array from paginated result
    const allApplications: Application[] = useMemo(
        () => data?.pages.flatMap((p) => p.items) ?? [],
        [data],
    );

    const total = data?.pages?.[0]?.total ?? 0;

    const { sentinelRef } = useInfiniteScroll({
        root: null,
        rootMargin: '400px',
        threshold: 0,
        hasNextPage,
        isFetchingNextPage,
        onLoadMore: fetchNextPage,
    });

    // Filter applications for this employer's jobs
    const applications = useMemo(() => {
        return allApplications.filter((app: Application) =>
            jobs.some((job) => job.id === app.jobId)
        );
    }, [allApplications, jobs]);

    // Update application mutation
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const updateApplicationMutation = useMutation({
        mutationFn: ({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) =>
            applicationService.update(applicationId, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allApplications'] });
            queryClient.invalidateQueries({ queryKey: ['candidateApplications'] });
            queryClient.invalidateQueries({ queryKey: ['employerApplications'] });
            toast({
                title: 'Application updated successfully',
                description: 'The application status has been updated.',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Update failed',
                description: error.response?.data?.message || 'Failed to update application',
                variant: 'destructive',
            });
        },
    });

    // Filter and sort applications
    const filteredApplications = useMemo(() => {
        let filtered = [...applications];

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        // Filter by job
        if (jobFilter !== 'all') {
            filtered = filtered.filter(app => app.jobId === jobFilter);
        }

        // Filter by search query (candidate name or email)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(app => {
                const candidateName = app.candidateProfile?.fullName?.toLowerCase() || '';
                const displayName = app.candidateProfile?.displayName?.toLowerCase() || '';
                return candidateName.includes(query) || displayName.includes(query);
            });
        }

        // Sort
        filtered.sort((a, b) => {
            const dateA = new Date(a.appliedAt).getTime();
            const dateB = new Date(b.appliedAt).getTime();
            return sortBy === 'recent' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [applications, statusFilter, jobFilter, searchQuery, sortBy]);

    // Calculate statistics
    const stats = useMemo(() => ({
        total: applications.length,
        applied: applications.filter(a => a.status === ApplicationStatus.applied).length,
        viewed: applications.filter(a => a.status === ApplicationStatus.viewed).length,
        shortlisted: applications.filter(a => a.status === ApplicationStatus.shortlisted).length,
        interview: applications.filter(a => a.status === ApplicationStatus.interview).length,
        offer: applications.filter(a => a.status === ApplicationStatus.offer).length,
        hired: applications.filter(a => a.status === ApplicationStatus.hired).length,
        rejected: applications.filter(a => a.status === ApplicationStatus.rejected).length,
    }), [applications]);

    const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
        updateApplicationMutation.mutate({ applicationId, status: newStatus });
    };

    const handleClearFilters = () => {
        setStatusFilter('all');
        setJobFilter('all');
        setSearchQuery('');
        setSortBy('recent');
    };

    if (userLoading || profileLoading || applicationsLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-12 w-64 mb-8" />
                <div className="grid gap-6 md:grid-cols-4 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-48" />
                    ))}
                </div>
            </div>
        );
    }

    if (!user || user.role !== UserRole.employer) {
        return (
            <NotAuthorizedUser userType={user?.role} />
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Fixed Header - Sticky on Desktop */}
            <div className="sticky top-0 z-10 bg-background border-b">
                <div className="container mx-auto px-4 py-4 md:py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-0">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Manage Applications</h1>
                                <p className="text-sm md:text-base text-muted-foreground">
                                    {total > 0 ? (
                                        <>
                                            Showing {filteredApplications.length} of {total}{' '}
                                            {total === 1 ? 'application' : 'applications'}
                                        </>
                                    ) : (
                                        <>
                                            {filteredApplications.length}{' '}
                                            {filteredApplications.length === 1 ? 'application' : 'applications'} found
                                        </>
                                    )}
                                </p>
                            </div>

                            {/* Mobile Buttons */}
                            <div className="flex gap-2 md:hidden">
                                <MobileApplicationStatsDrawer stats={stats} />
                                <MobileApplicationFilterDrawer
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    jobFilter={jobFilter}
                                    setJobFilter={setJobFilter}
                                    statusFilter={statusFilter}
                                    setStatusFilter={setStatusFilter}
                                    sortBy={sortBy}
                                    setSortBy={setSortBy}
                                    jobs={jobs}
                                />
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>

                            <DesktopApplicationFilterDrawer
                                jobFilter={jobFilter}
                                setJobFilter={setJobFilter}
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                jobs={jobs}
                            />
                        </div>
                    </div>

                    {/* Stats Cards - Desktop Only */}
                    <div className="hidden md:block mt-4 mb-4">
                        <ApplicationStats stats={stats} />
                    </div>


                </div>
            </div>

            {/* Scrollable Applications List */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 py-6">
                    {isError ? (
                        <div className="text-sm text-muted-foreground mb-4">
                            Failed to load applications. Please try again.
                        </div>
                    ) : null}
                    <ApplicationList
                        isLoading={jobsLoading}
                        filteredApplications={filteredApplications}
                        allApplicationsCount={applications.length}
                        jobs={jobs}
                        onStatusChange={handleStatusChange}
                        onClearFilters={handleClearFilters}
                    />

                    <div ref={sentinelRef} className="h-8" />

                    {isFetchingNextPage && (
                        <div className="space-y-4 mt-4">
                            {[1, 2].map((i) => (
                                <Skeleton key={i} className="h-48" />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
