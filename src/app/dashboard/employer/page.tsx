'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
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
  Building2,
  MapPin
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { jobService } from '@/services/job.service';
import { employerProfileService } from '@/services/employer-profile.service';
import { applicationService } from '@/services/application.service';
import { JobStatus, ApplicationStatus } from '@/types';

export default function EmployerDashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch current user
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getMe,
  });

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      // Check if user has completed profile
      employerProfileService.findByUser(user.id).catch(() => {
        // If profile doesn't exist, redirect to complete profile
        router.push(FRONTEND_ROUTES.PROFILE.EMPLOYER.COMPLETE);
      });
    }
  }, [user, router]);

  // Fetch employer profile
  const { data: profile } = useQuery({
    queryKey: ['employerProfile', userId],
    queryFn: () => employerProfileService.findByUser(userId!),
    enabled: !!userId,
  });

  // Fetch jobs
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['employerJobs', profile?.id],
    queryFn: () => jobService.findByEmployer(profile!.id),
    enabled: !!profile?.id,
  });

  // Fetch all applications for this employer
  const { data: allApplications = [] } = useQuery({
    queryKey: ['allApplications'],
    queryFn: applicationService.findAll,
  });

  // Filter applications for this employer's jobs
  const applications = allApplications.filter(app => 
    jobs.some(job => job.id === app.jobId)
  );

  // Calculate statistics
  const stats = {
    activeJobs: jobs.filter(j => j.status === JobStatus.published).length,
    totalApplications: applications.length,
    newApplications: applications.filter(a => a.status === ApplicationStatus.applied).length,
    totalViews: jobs.reduce((sum, job) => sum + job.viewCount, 0),
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

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'employer') {
    return (
      <Alert variant="destructive" className="container mx-auto my-8">
        <AlertDescription>
          You don't have access to this page. Please sign in as an employer.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Employer Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your job postings and applications
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/profile/employer/edit">
              Edit Profile
            </Link>
          </Button>
          <Button asChild>
            <Link href="/jobs/create">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Post a Job
            </Link>
          </Button>
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Jobs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {jobs.length} total jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Applications
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.newApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Job Postings</CardTitle>
              <CardDescription>Manage your published job listings</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/jobs/manage">
                View All
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
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
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first job posting to start receiving applications
              </p>
              <Button asChild>
                <Link href="/jobs/create">
                  <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
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
                    href={`/jobs/${job.id}/manage`}
                    className="block p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <h4 className="font-semibold">{job.title}</h4>
                          <Badge className={getJobStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        {job.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                            {job.location.city}, {job.location.country}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" aria-hidden="true" />
                            {jobApplications.length} applications
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            {job.viewCount} views
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" aria-hidden="true" />
                            {jobApplications.filter(a => a.status === ApplicationStatus.applied).length} new
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
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
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest candidates who applied to your jobs</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/applications/manage">
                View All
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-muted-foreground">
                Applications will appear here once candidates start applying
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
                    className="block p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {application.candidate?.displayName || application.candidate?.fullName || 'Candidate'}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Applied for: {job?.title || 'Job'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
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
