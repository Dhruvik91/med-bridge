'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useGetJobsByEmployer } from '@/hooks/get/useGetJobsByEmployer';
import { useGetApplications } from '@/hooks/get/useGetApplications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/services/application.service';
import { useToast } from '@/hooks/use-toast';
import { ApplicationStatus, UserRole, Job, Application } from '@/types';
import { ApplicationStats } from '../components/ApplicationStats';
import { ApplicationFilters } from '../components/ApplicationFilters';
import { ApplicationList } from '../components/ApplicationList';
import { MobileApplicationStatsDrawer } from '../components/MobileApplicationStatsDrawer';
import { MobileApplicationFilterDrawer } from '../components/MobileApplicationFilterDrawer';
import { NotAuthorizedUser } from '@/components/NotAuthorized';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function ManageApplications() {
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
    const [jobFilter, setJobFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

    // Fetch current user
    const { data: user, isLoading: userLoading } = useGetMe();

    // Fetch employer profile
    const { data: profile, isLoading: profileLoading } = useGetEmployerProfile(user);

    // Fetch employer's jobs
    const { data: jobs = [], isLoading: jobsLoading } = useGetJobsByEmployer(profile?.id || '');

    // Fetch all applications
    const { data: allApplications = [] } = useGetApplications();

    // Filter applications for this employer's jobs
    const applications = useMemo(() => {
        return (allApplications as Application[]).filter((app) =>
            (jobs as Job[]).some((job) => job.id === app.jobId)
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

    if (userLoading || profileLoading) {
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
                                    {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'} found
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

                        <Button asChild size="lg" className="w-full md:w-auto hidden md:flex">
                            <Link href={FRONTEND_ROUTES.DASHBOARD.EMPLOYER}>
                                Back to Dashboard
                            </Link>
                        </Button>
                    </div>

                    {/* Stats Cards - Desktop Only */}
                    <div className="hidden md:block mt-4 mb-4">
                        <ApplicationStats stats={stats} />
                    </div>

                    {/* Filters - Desktop Only */}
                    <div className="hidden md:block mt-4">
                        <ApplicationFilters
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
            </div>

            {/* Scrollable Applications List */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 py-6">
                    <ApplicationList
                        isLoading={jobsLoading}
                        filteredApplications={filteredApplications}
                        allApplicationsCount={applications.length}
                        jobs={jobs}
                        onStatusChange={handleStatusChange}
                        onClearFilters={handleClearFilters}
                    />
                </div>
            </div>
        </div>
    );
}
