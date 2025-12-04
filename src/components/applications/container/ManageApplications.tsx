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
                const candidateName = app.candidate?.fullName?.toLowerCase() || '';
                const displayName = app.candidate?.displayName?.toLowerCase() || '';
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
    };

    if (userLoading || profileLoading) {
        return (
            <main className="pt-16 min-h-screen bg-background">
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
            </main>
        );
    }

    if (!user || user.role !== UserRole.employer) {
        return (
            <main className="pt-16 min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <Alert variant="destructive">
                        <AlertDescription>
                            You don't have access to this page. Please sign in as an employer.
                        </AlertDescription>
                    </Alert>
                </div>
            </main>
        );
    }

    return (
        <main className="pt-16 min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Applications</h1>
                    <p className="text-muted-foreground">
                        Review and manage applications from candidates
                    </p>
                </div>

                {/* Stats Cards */}
                <ApplicationStats stats={stats} />

                {/* Filters */}
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

                {/* Applications List */}
                <ApplicationList
                    isLoading={jobsLoading}
                    filteredApplications={filteredApplications}
                    allApplicationsCount={applications.length}
                    jobs={jobs}
                    onStatusChange={handleStatusChange}
                    onClearFilters={handleClearFilters}
                />

                {/* Back to Dashboard Link */}
                {filteredApplications.length > 0 && (
                    <div className="mt-8 text-center">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/employer">Back to Dashboard</Link>
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}
