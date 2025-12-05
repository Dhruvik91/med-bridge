'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Eye,
    TrendingUp,
} from 'lucide-react';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetDoctorProfile } from '@/hooks/get/useGetDoctorProfile';
import { useGetApplicationsByCandidate } from '@/hooks/get/useGetApplications';
import { useGetSavedJobs } from '@/hooks/get/useGetSavedJobs';
import { ApplicationStatus, UserRole } from '@/types';
import { DashboardHeader } from '../components/DashboardHeader';
import { ProfileCompletionAlert } from '../components/ProfileCompletionAlert';
import { StatsGrid } from '../components/StatsGrid';
import { ApplicationsList } from '../components/ApplicationsList';
import { SavedJobsList } from '../components/SavedJobsList';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export function CandidateDashboard() {
    const router = useRouter();

    // Fetch current user
    const { data: user, isLoading: userLoading } = useGetMe();

    // Fetch doctor profile
    const { data: profile, isLoading: profileLoading } = useGetDoctorProfile(user?.id || '');

    // Fetch applications
    const { data: applications = [], isLoading: applicationsLoading } = useGetApplicationsByCandidate(profile?.id || '');

    // Fetch saved jobs
    const { data: savedJobs = [], isLoading: savedJobsLoading } = useGetSavedJobs(user?.id || '');

    useEffect(() => {
        if (user && !profileLoading && !profile) {
            // If profile doesn't exist and we're done loading, redirect to complete profile
            router.push(FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE);
        }
    }, [user, profile, profileLoading, router]);

    // Calculate statistics
    const stats = {
        total: applications.length,
        viewed: applications.filter(a => a.status === ApplicationStatus.viewed).length,
        interview: applications.filter(a => a.status === ApplicationStatus.interview).length,
        pending: applications.filter(a => a.status === ApplicationStatus.applied).length,
        savedJobs: savedJobs.length,
    };

    // Status icon helper
    const getStatusIcon = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.applied:
                return <Clock className="h-4 w-4" />;
            case ApplicationStatus.viewed:
                return <Eye className="h-4 w-4" />;
            case ApplicationStatus.interview:
                return <TrendingUp className="h-4 w-4" />;
            case ApplicationStatus.hired:
                return <CheckCircle2 className="h-4 w-4" />;
            case ApplicationStatus.rejected:
                return <XCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    // Status color helper
    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.hired:
                return 'bg-green-500/10 text-green-700 dark:text-green-400';
            case ApplicationStatus.interview:
            case ApplicationStatus.shortlisted:
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
            case ApplicationStatus.rejected:
            case ApplicationStatus.withdrawn:
                return 'bg-red-500/10 text-red-700 dark:text-red-400';
            case ApplicationStatus.viewed:
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
            default:
                return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
        }
    };

    // Check if profile is incomplete
    const isProfileIncomplete = profile && (!profile.fullName || !profile.phone || !profile.city || !profile.country);

    // Loading state
    if (userLoading || profileLoading) {
        return <LoadingSkeleton />;
    }

    // Access control
    if (!user || user.role !== UserRole.candidate) {
        return (
            <Alert variant="destructive" className="container mx-auto my-8">
                <AlertDescription>
                    You don't have access to this page. Please sign in as a candidate.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
            <DashboardHeader displayName={profile?.displayName || undefined} fullName={profile?.fullName || undefined} />

            <ProfileCompletionAlert isIncomplete={!!isProfileIncomplete} />

            <StatsGrid stats={stats} />

            <ApplicationsList
                applications={applications}
                isLoading={applicationsLoading}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
            />

            <SavedJobsList savedJobs={savedJobs} isLoading={savedJobsLoading} />
        </div>
    );
}
