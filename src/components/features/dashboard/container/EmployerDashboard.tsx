'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Briefcase, FileText, Eye, Users } from 'lucide-react';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useGetJobsByEmployer } from '@/hooks/get/useGetJobsByEmployer';
import { useGetApplications } from '@/hooks/get/useGetApplications';
import { JobStatus, ApplicationStatus, UserRole, Application } from '@/types';
import { DashboardHeader } from '../components/DashboardHeader';
import { ProfileCompletionAlert } from '../components/ProfileCompletionAlert';
import { StatsCard } from '../components/StatsCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ActiveJobsList } from '../components/ActiveJobsList';
import { RecentApplicationsList } from '../components/RecentApplicationsList';
import { NotAuthorizedUser } from '@/components/NotAuthorized';

// Utility function for job status colors
const getJobStatusColor = (status: JobStatus) => {
    switch (status) {
        case JobStatus.published:
            return 'bg-green-500/10 text-green-700 dark:text-green-400';
        case JobStatus.draft:
            return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
        case JobStatus.closed:
            return 'bg-red-500/10 text-red-700 dark:text-red-400';
        case JobStatus.archived:
            return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
        default:
            return '';
    }
};

export function EmployerDashboard() {
    const router = useRouter();

    // Fetch current user
    const { data: user, isLoading: userLoading } = useGetMe();

    // Fetch employer profile
    const { data: profile, isLoading: profileLoading } = useGetEmployerProfile(user);

    // Fetch jobs
    const { data: jobsData, isLoading: jobsLoading } = useGetJobsByEmployer(profile?.id || '');

    // Fetch all applications for this employer (paginated)
    const { data: applicationsData } = useGetApplications();

    useEffect(() => {
        if (user && !profileLoading && !profile) {
            // If profile doesn't exist and we're done loading, redirect to complete profile
            router.push(FRONTEND_ROUTES.PROFILE.EMPLOYER.COMPLETE);
        }
    }, [user, profile, profileLoading, router]);

    // Derived jobs array from paginated result
    const jobs = jobsData?.items ?? [];

    // Derived applications array from paginated result
    const allApplications: Application[] = applicationsData?.items ?? [];

    // Filter applications for this employer's jobs
    const applications: Application[] = allApplications.filter((app: Application) =>
        jobs.some(job => job.id === app.jobId)
    );

    // Calculate statistics
    const stats = useMemo(() => {
        return {
            activeJobs: jobs.filter(j => j.status === JobStatus.published).length,
            totalApplications: applications.length,
            newApplications: applications.filter(a => a.status === ApplicationStatus.applied).length,
            totalViews: jobs.reduce((sum, job) => sum + (job.viewCount || job.viewsCount ? Number(job.viewCount || job.viewsCount || 0) : 0), 0),
        };
    }, [jobs, applications]);

    if (userLoading || profileLoading) {
        return <LoadingSkeleton />;
    }

    if (!user || user.role !== UserRole.employer) {
        return (
            <NotAuthorizedUser userType={user?.role || ''} />
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
            {/* Header */}
            <DashboardHeader
                title="Employer Dashboard"
                description="Manage your job postings and applications"
            />

            {/* Profile Completion Alert */}
            {profile && (!profile.name || !profile.phone) && (
                <ProfileCompletionAlert
                    message="Complete your company profile to start posting jobs"
                    linkHref={FRONTEND_ROUTES.PROFILE.EMPLOYER.EDIT}
                    linkText="Complete Profile"
                />
            )}

            {/* Stats Grid */}
            <div className="grid gap-3 grid-cols-2 md:gap-6 lg:grid-cols-4">
                <StatsCard
                    title="Active Jobs"
                    value={stats.activeJobs}
                    description={`${jobs.length} total`}
                    icon={Briefcase}
                />
                <StatsCard
                    title="Applications"
                    value={stats.totalApplications}
                    description="All jobs"
                    icon={FileText}
                />
                <StatsCard
                    title="New Apps"
                    value={stats.newApplications}
                    description="Pending"
                    icon={Users}
                />
                <StatsCard
                    title="Total Views"
                    value={stats.totalViews}
                    description="All time"
                    icon={Eye}
                />
            </div>

            {/* Active Jobs and Recent Applications - Side by Side */}
            <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                {/* Active Jobs */}
                <ActiveJobsList
                    jobs={jobs}
                    applications={applications}
                    isLoading={jobsLoading}
                    getJobStatusColor={getJobStatusColor}
                />

                {/* Recent Applications */}
                <RecentApplicationsList
                    applications={applications}
                    jobs={jobs}
                />
            </div>
        </div>
    );
}
