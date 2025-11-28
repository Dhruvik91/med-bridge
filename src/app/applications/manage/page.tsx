'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Clock,
  Eye,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Briefcase,
  Calendar,
  ArrowRight,
  Filter,
  Search,
  Mail,
  Phone,
  MapPin,
  Award
} from 'lucide-react';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useGetJobsByEmployer } from '@/hooks/get/useGetJobsByEmployer';
import { useGetApplications } from '@/hooks/get/useGetApplications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/services/application.service';
import { useToast } from '@/hooks/use-toast';
import { ApplicationStatus, UserRole } from '@/types';

export default function ManageApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

  // Fetch current user
  const { data: user, isLoading: userLoading } = useGetMe();

  // Fetch employer profile
  const { data: profile, isLoading: profileLoading } = useGetEmployerProfile(user);

  // Fetch employer's jobs
  const { data: jobs = [], isLoading: jobsLoading } = useGetJobsByEmployer(profile?.id || '');

  // Fetch all applications
  const { data: allApplications = [] } = useGetApplications();

  // Filter applications for this employer's jobs
  const applications = useMemo(() => {
    return allApplications.filter((app: any) => 
      jobs.some((job: any) => job.id === app.jobId)
    );
  }, [allApplications, jobs]);

  // Update application mutation
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateApplicationMutation = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) => 
      applicationService.update(applicationId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allApplications'] });
      queryClient.invalidateQueries({ queryKey: ['candidateApplications'] });
      queryClient.invalidateQueries({ queryKey: ['employerApplications'] });
      toast({
        title: 'Application updated successfully',
        description: 'The application status has been updated.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'Failed to update application',
        variant: 'destructive',
      });
    },
  });

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by job
    if (jobFilter !== 'all') {
      filtered = filtered.filter(app => app.jobId === jobFilter);
    }

    // Filter by search query (candidate name or email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => {
        const candidateName = app.candidate?.fullName?.toLowerCase() || '';
        const displayName = app.candidate?.displayName?.toLowerCase() || '';
        return candidateName.includes(query) || displayName.includes(query);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.appliedAt).getTime();
      const dateB = new Date(b.appliedAt).getTime();
      return sortBy === 'recent' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [applications, statusFilter, jobFilter, searchQuery, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => ({
    total: applications.length,
    applied: applications.filter(a => a.status === ApplicationStatus.applied).length,
    viewed: applications.filter(a => a.status === ApplicationStatus.viewed).length,
    shortlisted: applications.filter(a => a.status === ApplicationStatus.shortlisted).length,
    interview: applications.filter(a => a.status === ApplicationStatus.interview).length,
    offer: applications.filter(a => a.status === ApplicationStatus.offer).length,
    hired: applications.filter(a => a.status === ApplicationStatus.hired).length,
    rejected: applications.filter(a => a.status === ApplicationStatus.rejected).length,
  }), [applications]);

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

  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
    updateApplicationMutation.mutate({ applicationId, status: newStatus });
  };

  if (userLoading || profileLoading) {
    return (
      <main className="pt-16 min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user || user.role !== UserRole.employer) {
    return (
      <main className="pt-16 min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>
              You don't have access to this page. Please sign in as an employer.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Applications</h1>
          <p className="text-muted-foreground">
            Review and manage applications from candidates
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8 mb-8">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">New</CardTitle>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Shortlisted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.shortlisted}</div>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.offer}</div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Candidates</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Job</label>
                <Select value={jobFilter} onValueChange={setJobFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Jobs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Status</label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Applications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value={ApplicationStatus.applied}>New Applications</SelectItem>
                    <SelectItem value={ApplicationStatus.viewed}>Viewed</SelectItem>
                    <SelectItem value={ApplicationStatus.shortlisted}>Shortlisted</SelectItem>
                    <SelectItem value={ApplicationStatus.interview}>Interview</SelectItem>
                    <SelectItem value={ApplicationStatus.offer}>Offer</SelectItem>
                    <SelectItem value={ApplicationStatus.hired}>Hired</SelectItem>
                    <SelectItem value={ApplicationStatus.rejected}>Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
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
        {jobsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {applications.length === 0
                  ? "Applications will appear here once candidates start applying to your jobs."
                  : "Try adjusting your filters to see more applications."}
              </p>
              {applications.length === 0 ? (
                <Button asChild size="lg">
                  <Link href="/jobs/create">
                    Post a Job
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStatusFilter('all');
                    setJobFilter('all');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const job = jobs.find(j => j.id === application.jobId);
              const candidate = application.candidate;
              
              return (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-1">
                              {candidate?.displayName || candidate?.fullName || 'Candidate'}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                {job?.title || 'Job Title'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Applied {formatDate(application.appliedAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Candidate Details */}
                        {candidate && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            {candidate.experienceYears !== null && candidate.experienceYears !== undefined && (
                              <div className="flex items-center gap-2 text-sm">
                                <Award className="h-4 w-4 text-muted-foreground" />
                                <span>{candidate.experienceYears} years experience</span>
                              </div>
                            )}
                            {candidate.city && candidate.country && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{candidate.city}, {candidate.country}</span>
                              </div>
                            )}
                            {candidate.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{candidate.phone}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Specialties */}
                        {candidate?.specialties && candidate.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {candidate.specialties.slice(0, 3).map((specialty, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {candidate.specialties.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.specialties.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Cover Letter */}
                        {application.coverLetter && (
                          <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-sm font-medium mb-1">Cover Letter</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {application.coverLetter}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={getStatusColor(application.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            {getStatusLabel(application.status)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex flex-wrap gap-2">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Update Status</label>
                      <Select
                        value={application.status}
                        onValueChange={(value) => handleStatusChange(application.id, value as ApplicationStatus)}
                      >
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ApplicationStatus.applied}>New Application</SelectItem>
                          <SelectItem value={ApplicationStatus.viewed}>Viewed</SelectItem>
                          <SelectItem value={ApplicationStatus.shortlisted}>Shortlisted</SelectItem>
                          <SelectItem value={ApplicationStatus.interview}>Interview</SelectItem>
                          <SelectItem value={ApplicationStatus.offer}>Offer</SelectItem>
                          <SelectItem value={ApplicationStatus.hired}>Hired</SelectItem>
                          <SelectItem value={ApplicationStatus.rejected}>Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 items-end">
                      {candidate?.resumeUrl && (
                        <Button asChild variant="outline" size="sm">
                          <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                            View Resume
                          </a>
                        </Button>
                      )}
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/jobs/${application.jobId}`}>
                          View Job
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Back to Dashboard Link */}
        {filteredApplications.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard/employer">Back to Dashboard</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
