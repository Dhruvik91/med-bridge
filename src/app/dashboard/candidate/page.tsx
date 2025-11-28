'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Briefcase,
  BookmarkPlus,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  ArrowRight,
  Plus,
  Building2
} from 'lucide-react';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetDoctorProfile } from '@/hooks/get/useGetDoctorProfile';
import { useGetApplicationsByCandidate } from '@/hooks/get/useGetApplications';
import { useGetSavedJobs } from '@/hooks/get/useGetSavedJobs';
import { ApplicationStatus, UserRole } from '@/types';

export default function CandidateDashboardPage() {
  const router = useRouter();

  // Fetch current user
  const { data: user, isLoading: userLoading } = useGetMe();

  // Fetch doctor profile
  const { data: profile } = useGetDoctorProfile(user?.id || '');

  // Fetch applications
  const { data: applications = [], isLoading: applicationsLoading } = useGetApplicationsByCandidate(profile?.id || '');

  // Fetch saved jobs
  const { data: savedJobs = [], isLoading: savedJobsLoading } = useGetSavedJobs(user?.id || '');

  useEffect(() => {
    if (user && !profile) {
      // If profile doesn't exist, redirect to complete profile
      router.push(FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE);
    }
  }, [user, profile, router]);

  // Calculate statistics
  const stats = {
    total: applications.length,
    viewed: applications.filter(a => a.status === ApplicationStatus.viewed).length,
    interview: applications.filter(a => a.status === ApplicationStatus.interview).length,
    pending: applications.filter(a => a.status === ApplicationStatus.applied).length,
  };

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

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
        <Skeleton className="h-8 md:h-12 w-48 md:w-64" />
        <div className="grid gap-3 grid-cols-2 md:gap-6 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 md:h-32" />
          ))}
        </div>
      </div>
    );
  }

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Welcome back{profile?.displayName ? `, ${profile.displayName}` : profile?.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Here's your job search overview
          </p>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {profile && (!profile.fullName || !profile.phone || !profile.city || !profile.country) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Complete your profile to increase your chances of getting hired</span>
            <Button asChild variant="link" size="sm">
              <Link href="/profile">
                Complete Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-3 grid-cols-2 md:gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total Applications
            </CardTitle>
            <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="text-xl md:text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="text-xl md:text-3xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Interviews
            </CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="text-xl md:text-3xl font-bold">{stats.interview}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Saved Jobs
            </CardTitle>
            <BookmarkPlus className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="text-xl md:text-3xl font-bold">{savedJobs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Bookmarked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-foreground">Recent Applications</CardTitle>
              <CardDescription className="text-sm md:text-base text-muted-foreground mt-1">Track the status of your job applications</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="self-start sm:self-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
              <Link href="/applications" className="flex items-center gap-2">
                <span className="font-medium">View All</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {applicationsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border-2 border-dashed border-muted">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">No applications yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start applying to jobs to see them here and track your application progress
              </p>
              <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/jobs">
                  <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Browse Jobs
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 5).map((application) => (
                <Link
                  key={application.id}
                  href={`/applications/${application.id}`}
                  className="group block p-4 md:p-5 border rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 bg-gradient-to-r from-background to-muted/20 hover:from-primary/5 hover:to-primary/10"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-3">
                        <h4 className="font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors">{application.job?.title || 'Job Title'}</h4>
                        <Badge className={`${getStatusColor(application.status)} font-medium`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            {application.status.replace('_', ' ')}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 bg-muted/30 rounded-md px-2 py-1 w-fit">
                        <Building2 className="h-4 w-4 text-primary inline mr-2" aria-hidden="true" />
                        {application.job?.organization?.name || application.job?.employerProfile?.name || 'Company Name'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-md px-2 py-1 w-fit">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="self-start md:self-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Jobs */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-foreground">Saved Jobs</CardTitle>
              <CardDescription className="text-sm md:text-base text-muted-foreground mt-1">Jobs you've bookmarked for later</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="self-start sm:self-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
              <Link href="/saved-jobs" className="flex items-center gap-2">
                <span className="font-medium">View All</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {savedJobsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : savedJobs.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border-2 border-dashed border-muted">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookmarkPlus className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">No saved jobs</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Save interesting jobs to review them later and apply when you're ready
              </p>
              <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/jobs">
                  <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Browse Jobs
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.slice(0, 5).map((savedJob) => (
                <Link
                  key={savedJob.id}
                  href={`/jobs/${savedJob.jobId}`}
                  className="group block p-4 md:p-5 border rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 bg-gradient-to-r from-background to-muted/20 hover:from-primary/5 hover:to-primary/10"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                          <BookmarkPlus className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                            {savedJob.job?.title || 'Job Title'}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className="font-medium">{savedJob.job?.organization?.name || savedJob.job?.employerProfile?.name || 'Company Name'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-md px-2 py-1 w-fit">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Saved {new Date(savedJob.savedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="self-start md:self-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Eye className="h-4 w-4 mr-2" />
                      View Job
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
