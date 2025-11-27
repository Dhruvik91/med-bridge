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
  BookmarkPlus,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  ArrowRight,
  Plus
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { applicationService } from '@/services/application.service';
import { savedJobService } from '@/services/saved-job.service';
import { doctorProfileService } from '@/services/doctor-profile.service';
import { ApplicationStatus } from '@/types';

export default function CandidateDashboardPage() {
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
      doctorProfileService.findByUser(user.id).catch(() => {
        // If profile doesn't exist, redirect to complete profile
        router.push(FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE);
      });
    }
  }, [user, router]);

  // Fetch doctor profile
  const { data: profile } = useQuery({
    queryKey: ['doctorProfile', userId],
    queryFn: () => doctorProfileService.findByUser(userId!),
    enabled: !!userId,
  });

  // Fetch applications
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['candidateApplications', profile?.id],
    queryFn: () => applicationService.findByCandidate(profile!.id),
    enabled: !!profile?.id,
  });

  // Fetch saved jobs
  const { data: savedJobs = [], isLoading: savedJobsLoading } = useQuery({
    queryKey: ['savedJobs', userId],
    queryFn: () => savedJobService.findByUser(userId!),
    enabled: !!userId,
  });

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

  if (!user || user.role !== 'candidate') {
    return (
      <Alert variant="destructive" className="container mx-auto my-8">
        <AlertDescription>
          You don't have access to this page. Please sign in as a candidate.
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
            Welcome back{profile?.displayName ? `, ${profile.displayName}` : profile?.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-muted-foreground mt-1">
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Interviews
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.interview}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saved Jobs
            </CardTitle>
            <BookmarkPlus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{savedJobs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Track the status of your job applications</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/applications">
                View All
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
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
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-6">
                Start applying to jobs to see them here
              </p>
              <Button asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 5).map((application) => (
                <Link
                  key={application.id}
                  href={`/applications/${application.id}`}
                  className="block p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate mb-1">
                        {application.job?.title || 'Job Title'}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {application.job?.organization?.name || application.job?.employerProfile?.name || 'Company Name'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Applied {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        {application.status.replace('_', ' ')}
                      </span>
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Jobs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Saved Jobs</CardTitle>
              <CardDescription>Jobs you've bookmarked for later</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/saved-jobs">
                View All
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
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
            <div className="text-center py-12">
              <BookmarkPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">No saved jobs</h3>
              <p className="text-muted-foreground mb-6">
                Save interesting jobs to review them later
              </p>
              <Button asChild>
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedJobs.slice(0, 5).map((savedJob) => (
                <Link
                  key={savedJob.id}
                  href={`/jobs/${savedJob.jobId}`}
                  className="block p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate mb-1">
                        {savedJob.job?.title || 'Job Title'}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {savedJob.job?.organization?.name || savedJob.job?.employerProfile?.name || 'Company Name'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Saved {new Date(savedJob.savedAt).toLocaleDateString()}
                      </p>
                    </div>
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
