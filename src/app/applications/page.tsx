'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Clock,
  Eye,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Building2,
  Calendar,
  ArrowRight,
  Filter
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import { applicationService } from '@/services/application.service';
import { doctorProfileService } from '@/services/doctor-profile.service';
import { ApplicationStatus } from '@/types';

export default function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

  // Fetch current user
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getMe,
  });

  // Fetch doctor profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['doctorProfile', user?.id],
    queryFn: () => doctorProfileService.findByUser(user!.id),
    enabled: !!user?.id,
  });

  // Fetch applications
  const { data: applications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ['candidateApplications', profile?.id],
    queryFn: () => applicationService.findByCandidate(profile!.id),
    enabled: !!profile?.id,
  });

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

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.applied:
        return <Clock className="h-4 w-4" />;
      case ApplicationStatus.viewed:
        return <Eye className="h-4 w-4" />;
      case ApplicationStatus.interview:
      case ApplicationStatus.shortlisted:
        return <TrendingUp className="h-4 w-4" />;
      case ApplicationStatus.hired:
      case ApplicationStatus.offer:
        return <CheckCircle2 className="h-4 w-4" />;
      case ApplicationStatus.rejected:
      case ApplicationStatus.withdrawn:
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.hired:
      case ApplicationStatus.offer:
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200';
      case ApplicationStatus.interview:
      case ApplicationStatus.shortlisted:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200';
      case ApplicationStatus.rejected:
      case ApplicationStatus.withdrawn:
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200';
      case ApplicationStatus.viewed:
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200';
      default:
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200';
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    return status.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (userLoading || profileLoading) {
    return (
      <>
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
      </>
    );
  }

  if (!user || user.role !== 'candidate') {
    return (
      <>
        <main className="pt-16 min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertDescription>
                You don't have access to this page. Please sign in as a candidate.
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Applications</h1>
            <p className="text-muted-foreground">
              Track and manage all your job applications
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.applied}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Viewed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.viewed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Interview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.interview}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Hired</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.hired}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Filter by Status</label>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Applications" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value={ApplicationStatus.applied}>Pending Review</SelectItem>
                      <SelectItem value={ApplicationStatus.viewed}>Viewed</SelectItem>
                      <SelectItem value={ApplicationStatus.shortlisted}>Shortlisted</SelectItem>
                      <SelectItem value={ApplicationStatus.interview}>Interview</SelectItem>
                      <SelectItem value={ApplicationStatus.offer}>Offer</SelectItem>
                      <SelectItem value={ApplicationStatus.hired}>Hired</SelectItem>
                      <SelectItem value={ApplicationStatus.rejected}>Rejected</SelectItem>
                      <SelectItem value={ApplicationStatus.withdrawn}>Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Sort by</label>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'recent' | 'oldest')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          {applicationsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">
                  {statusFilter === 'all' ? 'No applications yet' : `No ${getStatusLabel(statusFilter as ApplicationStatus).toLowerCase()} applications`}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {statusFilter === 'all' 
                    ? "Start applying to jobs to see them here. Browse available positions and submit your applications."
                    : "Try changing your filter to see other applications."}
                </p>
                {statusFilter === 'all' ? (
                  <Button asChild size="lg">
                    <Link href="/jobs">
                      Browse Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setStatusFilter('all')}>
                    View All Applications
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <Link href={`/jobs/${application.jobId}`} className="hover:underline">
                          <CardTitle className="text-xl mb-2">
                            {application.job?.title || 'Job Title'}
                          </CardTitle>
                        </Link>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {application.job?.organization?.name || application.job?.employerProfile?.name || 'Company'}
                          </span>
                          {application.job?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {application.job.location.city}, {application.job.location.country}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Applied {formatDate(application.appliedAt)}
                          </span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          {getStatusLabel(application.status)}
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  {application.coverLetter && (
                    <CardContent>
                      <CardDescription className="line-clamp-2">
                        <strong>Cover Letter:</strong> {application.coverLetter}
                      </CardDescription>
                    </CardContent>
                  )}
                  <CardFooter>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/jobs/${application.jobId}`}>
                        View Job Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Back to Dashboard Link */}
          {filteredApplications.length > 0 && (
            <div className="mt-8 text-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/candidate">Back to Dashboard</Link>
              </Button>
            </div>
          )}
        </div>
    </>
  );
}
