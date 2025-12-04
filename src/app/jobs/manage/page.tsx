'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  CheckCircle,
  XCircle,
  FileText,
  Plus,
  Filter,
  X,
  Users,
} from 'lucide-react';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useGetJobsByEmployer } from '@/hooks/get/useGetJobsByEmployer';
import { useDeleteJob } from '@/hooks/delete/useDeleteJob';
import { useUpdateJob } from '@/hooks/update/useUpdateJob';
import { Job, JobType, JobStatus, UserRole } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { useJobFormatters } from '@/hooks/useJobFormatters';

export default function ManageJobsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  // Get current user
  const { data: user } = useGetMe();

  // Get employer profile
  const { data: employerProfile } = useGetEmployerProfile(user);

  // Get employer's jobs
  const { data: jobs = [], isLoading } = useGetJobsByEmployer(employerProfile?.id || '');
  const { formatSalary, getJobTypeLabel } = useJobFormatters();

  // Delete hook
  const deleteJobMutation = useDeleteJob();

  // Handle job deletion
  const handleDeleteJob = (jobId: string) => {
    deleteJobMutation.mutate(jobId);
    setJobToDelete(null);
  };

  // Filter jobs
  useEffect(() => {
    let filtered = [...jobs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.specialties?.some((s) => s.name.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, statusFilter]);

  // Check if user is employer
  useEffect(() => {
    if (user && user.role !== UserRole.employer) {
      router.push(FRONTEND_ROUTES.JOBS.BASE);
    }
  }, [user, router]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.published:
        return 'bg-green-500/10 text-green-600 hover:bg-green-500/20';
      case JobStatus.draft:
        return 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20';
      case JobStatus.closed:
        return 'bg-red-500/10 text-red-600 hover:bg-red-500/20';
      case JobStatus.archived:
        return 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case JobStatus.published:
        return <CheckCircle className="h-4 w-4" />;
      case JobStatus.draft:
        return <FileText className="h-4 w-4" />;
      case JobStatus.closed:
        return <XCircle className="h-4 w-4" />;
      case JobStatus.archived:
        return <Archive className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getJobStats = () => {
    const total = jobs.length;
    const published = jobs.filter((j) => j.status === JobStatus.published).length;
    const draft = jobs.filter((j) => j.status === JobStatus.draft).length;
    const closed = jobs.filter((j) => j.status === JobStatus.closed).length;

    return { total, published, draft, closed };
  };

  const stats = getJobStats();

  if (!user || user.role !== UserRole.employer) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Manage Job Postings</h1>
            <p className="text-base text-muted-foreground">
              View and manage all your job listings
            </p>
          </div>
          <Button asChild size="lg" className="w-full md:w-auto">
            <Link href="/jobs/create">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="text-2xl md:text-3xl font-bold">{stats.total}</div>
              <p className="text-sm font-medium text-muted-foreground mt-1">Total Jobs</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="text-2xl md:text-3xl font-bold text-green-600">{stats.published}</div>
              <p className="text-sm font-medium text-muted-foreground mt-1">Published</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600">{stats.draft}</div>
              <p className="text-sm font-medium text-muted-foreground mt-1">Drafts</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="text-2xl md:text-3xl font-bold text-red-600">{stats.closed}</div>
              <p className="text-sm font-medium text-muted-foreground mt-1">Closed</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search job title, description, or specialty..."
                  className="pl-10 h-11 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as JobStatus | 'all')}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={JobStatus.published}>Published</SelectItem>
                  <SelectItem value={JobStatus.draft}>Draft</SelectItem>
                  <SelectItem value={JobStatus.closed}>Closed</SelectItem>
                  <SelectItem value={JobStatus.archived}>Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchQuery || statusFilter !== 'all') && (
              <div className="flex justify-start">
                <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="text-center py-16 shadow-sm">
          <CardHeader className="pb-6">
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-xl font-semibold">
              {jobs.length === 0 ? 'No jobs posted yet' : 'No jobs found'}
            </CardTitle>
            <CardDescription className="text-base mt-2 max-w-md mx-auto">
              {jobs.length === 0
                ? 'Get started by creating your first job posting to attract top medical talent'
                : 'Try adjusting your search criteria or clearing filters to see more results'}
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center pt-4">
            {jobs.length === 0 ? (
              <Button asChild size="lg">
                <Link href="/jobs/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Your First Job
                </Link>
              </Button>
            ) : (
              <Button onClick={clearFilters} variant="outline" size="lg">
                Clear Filters
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <CardTitle className="text-lg md:text-xl font-semibold leading-tight">{job.title}</CardTitle>
                      <Badge className={`${getStatusColor(job.status)} text-xs font-medium`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(job.status)}
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <Badge variant="secondary" className="font-medium">{getJobTypeLabel(job.jobType)}</Badge>
                      {job.location && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">{job.location.city}, {job.location.country}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`${FRONTEND_ROUTES.JOBS.BASE}/${job.id}`} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Job
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`${FRONTEND_ROUTES.JOBS.BASE}/${job.id}/edit`} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Job
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setJobToDelete(job.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0 pb-4">
                <CardDescription className="mb-4 line-clamp-2 text-sm leading-relaxed">
                  {job.description}
                </CardDescription>

                <div className="flex flex-wrap gap-2 mb-5">
                  {job.specialties?.slice(0, 3).map((specialty) => (
                    <Badge key={specialty.id} variant="outline" className="text-xs font-medium">
                      {specialty.name}
                    </Badge>
                  ))}
                  {job.specialties && job.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs font-medium">+{job.specialties.length - 3} more</Badge>
                  )}
                </div>


                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
                  <span className="flex items-center gap-1.5 text-primary font-semibold">
                    <DollarSign className="h-4 w-4" />
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <Eye className="h-4 w-4" />
                    {job.viewCount || job.viewsCount || 0} views
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <Clock className="h-4 w-4" />
                    Posted {new Date(job.postedDate || job.createdAt || job.publishedAt || new Date()).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                {
                  user?.role === UserRole.candidate &&
                  <Button asChild variant="default" className="flex-1 sm:flex-none font-medium">
                    <Link href={`${FRONTEND_ROUTES.APPLICATIONS.BASE}?job=${job.id}`}>
                      <Users className="mr-2 h-4 w-4" />
                      View Applications
                    </Link>
                  </Button>
                }
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-lg font-semibold">Delete Job Posting?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              This action cannot be undone. This will permanently delete the job posting and all
              associated data including applications and analytics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-3">
            <AlertDialogCancel className="font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => jobToDelete && handleDeleteJob(jobToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium"
            >
              Delete Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
