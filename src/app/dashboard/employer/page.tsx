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
  FileText,
  Eye,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  AlertCircle,
  MapPin,
  EyeIcon
} from 'lucide-react';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useGetJobsByEmployer } from '@/hooks/get/useGetJobsByEmployer';
import { useGetApplications } from '@/hooks/get/useGetApplications';
import { JobStatus, ApplicationStatus, UserRole } from '@/types';

export default function EmployerDashboardPage() {
  const router = useRouter();

  // Fetch current user
  const { data: user, isLoading: userLoading } = useGetMe();

  // Fetch employer profile
  const { data: profile, isLoading: profileLoading } = useGetEmployerProfile(user);

  // Fetch jobs
  const { data: jobs = [], isLoading: jobsLoading } = useGetJobsByEmployer(profile?.id || '');

  // Fetch all applications for this employer
  const { data: allApplications = [] } = useGetApplications();

  useEffect(() => {
    if (user && !profileLoading && !profile) {
      // If profile doesn't exist and we're done loading, redirect to complete profile
      router.push(FRONTEND_ROUTES.PROFILE.EMPLOYER.COMPLETE);
    }
  }, [user, profile, profileLoading, router]);

  // Filter applications for this employer's jobs
  const applications = allApplications.filter(app =>
    jobs.some(job => job.id === app.jobId)
  );

  // Calculate statistics
  const stats = {
    activeJobs: jobs.filter(j => j.status === JobStatus.published).length,
    totalApplications: applications.length,
    newApplications: applications.filter(a => a.status === ApplicationStatus.applied).length,
    totalViews: jobs.reduce((sum, job) => sum + (job.viewCount || job.viewsCount ? Number(job.viewCount || job.viewsCount || 0) : 0), 0),
  };

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

  if (userLoading || profileLoading) {
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

  if (!user || user.role !== UserRole.employer) {
    return (
      <Alert variant="destructive" className="container mx-auto my-8">
        <AlertDescription>
          You don't have access to this page. Please sign in as an employer.
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
            Employer Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your job postings and applications
          </p>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {profile && (!profile.name || !profile.phone) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Complete your company profile to start posting jobs</span>
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
              Active Jobs
            </CardTitle>
            <Briefcase className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="text-xl md:text-3xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {jobs.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Applications
            </CardTitle>
            <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="text-xl md:text-3xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              New Apps
            </CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="text-xl md:text-3xl font-bold">{stats.newApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 md:px-6 pt-3 md:pt-6">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
            <Eye className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
            <div className="text-xl md:text-3xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-foreground">Active Job Postings</CardTitle>
              <CardDescription className="text-sm md:text-base text-muted-foreground mt-1">Manage your published job listings</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="self-start sm:self-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
              <Link href={`${FRONTEND_ROUTES.JOBS.MANAGE}`} className="flex items-center gap-2">
                <span className="font-medium">View All</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border-2 border-dashed border-muted">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">No jobs posted yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first job posting to start receiving applications from qualified candidates
              </p>
              <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                <Link href="/jobs/create">
                  <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Post Your First Job
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.filter(j => j.status === JobStatus.published).slice(0, 5).map((job) => {
                const jobApplications = applications.filter(a => a.jobId === job.id);
                return (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="group block p-4 md:p-5 border rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 bg-gradient-to-r from-background to-muted/20 hover:from-primary/5 hover:to-primary/10"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-3">
                          <h4 className="font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors">{job.title}</h4>
                          <Badge variant="secondary" className={`${getJobStatusColor(job.status)} font-medium`}>
                            {job.status}
                          </Badge>
                        </div>
                        {job.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 bg-muted/30 rounded-md px-2 py-1 w-fit">
                            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                            <span className="font-medium">{job.location.city}, {job.location.country}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full">
                            <FileText className="h-4 w-4" aria-hidden="true" />
                            <span className="font-medium">{jobApplications.length}</span>
                            <span className="text-xs">apps</span>
                          </div>
                          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full">
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            <span className="font-medium">{job.viewCount || job.viewsCount || 0}</span>
                            <span className="text-xs">views</span>
                          </div>
                          {jobApplications.filter(a => a.status === ApplicationStatus.applied).length > 0 && (
                            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 px-3 py-1.5 rounded-full animate-pulse">
                              <TrendingUp className="h-4 w-4" aria-hidden="true" />
                              <span className="font-medium">{jobApplications.filter(a => a.status === ApplicationStatus.applied).length}</span>
                              <span className="text-xs">new</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="self-start md:self-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Job
                      </Button>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-foreground">Recent Applications</CardTitle>
              <CardDescription className="text-sm md:text-base text-muted-foreground mt-1">Latest candidates who applied to your jobs</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="self-start sm:self-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
              <Link href="/applications/manage" className="flex items-center gap-2">
                <span className="font-medium">View All</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border-2 border-dashed border-muted">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">No applications yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Applications will appear here once candidates start applying to your job postings
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 5).map((application) => {
                const job = jobs.find(j => j.id === application.jobId);
                return (
                  <Link
                    key={application.id}
                    href={`/applications/${application.id}`}
                    className="group block p-4 md:p-5 border rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 bg-gradient-to-r from-background to-muted/20 hover:from-primary/5 hover:to-primary/10"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                              {application.candidate?.displayName || application.candidate?.fullName || 'Candidate'}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Briefcase className="h-4 w-4 text-primary" />
                              <span className="font-medium">{job?.title || 'Job'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-md px-2 py-1 w-fit">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="self-start md:self-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
