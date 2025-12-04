'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetDoctorProfile } from '@/hooks/get/useGetDoctorProfile';
import { useGetApplicationsByCandidate } from '@/hooks/get/useGetApplications';
import { ApplicationStatus, UserRole } from '@/types';
import { CandidateApplicationStats } from '../components/CandidateApplicationStats';
import { CandidateApplicationFilters } from '../components/CandidateApplicationFilters';
import { CandidateApplicationList } from '../components/CandidateApplicationList';
import { NotAuthorizedUser } from '@/components/NotAuthorized';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function Applications() {
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

    // Fetch current user
    const { data: user, isLoading: userLoading } = useGetMe();

    // Fetch doctor profile
    const { data: profile, isLoading: profileLoading } = useGetDoctorProfile(user?.id || '');

    // Fetch applications
    const { data: applications = [], isLoading: applicationsLoading } = useGetApplicationsByCandidate(profile?.id || '');

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
        interview: applications.filter(a => a.status === ApplicationStatus.interview).length,
        hired: applications.filter(a => a.status === ApplicationStatus.hired).length,
        rejected: applications.filter(a => a.status === ApplicationStatus.rejected).length,
    };

    if (userLoading || profileLoading) {
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
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">My Applications</h1>
                <p className="text-muted-foreground">
                    Track and manage all your job applications
                </p>
            </div>

            {/* Stats Cards */}
            <CandidateApplicationStats stats={stats} />

            {/* Filters */}
            <CandidateApplicationFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            {/* Applications List */}
            <CandidateApplicationList
                isLoading={applicationsLoading}
                filteredApplications={filteredApplications}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            {/* Back to Dashboard Link */}
            {filteredApplications.length > 0 && (
                <div className="mt-8 text-center">
                    <Button variant="outline" asChild>
                        <Link href={FRONTEND_ROUTES.DASHBOARD.CANDIDATE}>Back to Dashboard</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
