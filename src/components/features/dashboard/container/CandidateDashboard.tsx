'use client';

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
    const { data: applicationsData, isLoading: applicationsLoading } = useGetApplicationsByCandidate(user?.id || '');

    // Fetch saved jobs (paginated)
    const { data: savedJobsData, isLoading: savedJobsLoading } = useGetSavedJobs(user?.id || '');

    // Derived arrays from paginated results
    const applications = applicationsData?.items ?? [];
    const savedJobs = savedJobsData?.items ?? [];

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
                return 'bg-primary/10 text-foreground';
            case ApplicationStatus.interview:
            case ApplicationStatus.shortlisted:
                return 'bg-secondary text-secondary-foreground';
            case ApplicationStatus.rejected:
            case ApplicationStatus.withdrawn:
                return 'bg-destructive/10 text-destructive';
            case ApplicationStatus.viewed:
                return 'bg-accent text-accent-foreground';
            default:
                return 'bg-muted text-muted-foreground';
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                <ApplicationsList
                    applications={applications}
                    isLoading={applicationsLoading}
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                />

                <SavedJobsList savedJobs={savedJobs} isLoading={savedJobsLoading} />
            </div>
        </div>
    );
}
