'use client';

import { useState, useMemo, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetApplicationsByCandidate } from '@/hooks/get/useGetApplications';
import { ApplicationStatus, UserRole } from '@/types';
import { CandidateApplicationStats } from '../components/CandidateApplicationStats';
import { CandidateApplicationFilters } from '../components/CandidateApplicationFilters';
import { MobileApplicationFilterDrawer } from '../components/MobileApplicationFilterDrawer';
import { MobileApplicationStatsDrawer } from '../components/MobileApplicationStatsDrawer';
import { CandidateApplicationList } from '../components/CandidateApplicationList';
import { NotAuthorizedUser } from '@/components/NotAuthorized';

export function Applications() {
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

    // Fetch current user
    const { data: user, isLoading: userLoading } = useGetMe();

    // Fetch applications (paginated)
    const { data: applicationsData, isLoading: applicationsLoading } = useGetApplicationsByCandidate(user?.id || '');

    // Derived applications array from paginated result
    const applications = applicationsData?.items ?? [];

    // Filter and sort applications
    const filteredApplications = useMemo(() => {
        let filtered = [...applications];

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        // Sort
        filtered.sort((a, b) => {
            const dateA = new Date(a.appliedAt).getTime();
            const dateB = new Date(b.appliedAt).getTime();
            return sortBy === 'recent' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }, [applications, statusFilter, sortBy]);

    // Calculate statistics
    const stats = {
        total: applications.length,
        applied: applications.filter(a => a.status === ApplicationStatus.applied).length,
        viewed: applications.filter(a => a.status === ApplicationStatus.viewed).length,
        shortlisted: applications.filter(a => a.status === ApplicationStatus.shortlisted).length,
        interview: applications.filter(a => a.status === ApplicationStatus.interview).length,
        offer: applications.filter(a => a.status === ApplicationStatus.offer).length,
        hired: applications.filter(a => a.status === ApplicationStatus.hired).length,
        rejected: applications.filter(a => a.status === ApplicationStatus.rejected).length,
    };

    const handleClearFilters = useCallback(() => {
        setStatusFilter('all');
        setSortBy('recent');
    }, []);

    const showClearButton = !!(statusFilter !== 'all' || sortBy !== 'recent');

    if (userLoading || applicationsLoading) {
        return (
            <main className="pt-16 min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <Skeleton className="h-12 w-64 mb-8" />
                    <div className="grid gap-6 md:grid-cols-3 mb-8">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-24" />
                        ))}
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} className="h-40" />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (!user || user.role !== UserRole.candidate) {
        return (
            <NotAuthorizedUser userType={user?.role} />
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Fixed Header - Sticky on Desktop */}
            <div className="sticky top-0 z-10 bg-background border-b">
                <div className="container mx-auto px-4 py-4 md:py-6">
                    <div className="flex items-center justify-between mb-4 md:mb-0">
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
                                My Applications
                            </h1>
                            <p className="text-sm md:text-base text-muted-foreground">
                                {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'} found
                            </p>
                        </div>

                        {/* Mobile Buttons */}
                        <div className="flex gap-2 md:hidden">
                            <MobileApplicationStatsDrawer stats={stats} />
                            <MobileApplicationFilterDrawer
                                statusFilter={statusFilter}
                                sortBy={sortBy}
                                setStatusFilter={setStatusFilter}
                                setSortBy={setSortBy}
                                onClearFilters={handleClearFilters}
                                showClearButton={showClearButton}
                            />
                        </div>
                    </div>

                    {/* Stats Cards - Desktop Only */}
                    <div className="hidden md:block mt-4 mb-4">
                        <CandidateApplicationStats stats={stats} />
                    </div>

                    {/* Desktop Filters - Inline */}
                    <div className="mt-4">
                        <CandidateApplicationFilters
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            onClearFilters={handleClearFilters}
                            showClearButton={showClearButton}
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable Applications List */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 py-6">
                    <CandidateApplicationList
                        isLoading={applicationsLoading}
                        filteredApplications={filteredApplications}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />
                </div>
            </div>
        </div>
    );
}
