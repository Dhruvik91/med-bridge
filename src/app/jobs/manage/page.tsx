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

  // Delete hook
  const deleteJobMutation = useDeleteJob();

  // Handle job deletion
  const handleDeleteJob = (jobId: string) => {
    deleteJobMutation.mutate(jobId);
    setJobToDelete(null);
  };

  // Handle status update
  const handleStatusUpdate = (jobId: string, status: JobStatus) => {
    const updateJobMutation = useUpdateJob(jobId);
    updateJobMutation.mutate({ status });
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
      router.push('/jobs');
    }
  }, [user, router]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `From $${(min / 1000).toFixed(0)}k`;
    return `Up to $${(max! / 1000).toFixed(0)}k`;
  };

  const getJobTypeLabel = (type: JobType) => {
    return type.replace('_', ' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Job Postings</h1>
            <p className="text-muted-foreground">
              View and manage all your job listings
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/jobs/create">
              <Plus className="mr-2 h-5 w-5" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{stats.closed}</div>
              <p className="text-sm text-muted-foreground">Closed</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search job title, description, or specialty"
                  className="pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as JobStatus | 'all')}
              >
                <SelectTrigger>
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
              <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
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
        <Card className="text-center py-16">
          <CardHeader>
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle>
              {jobs.length === 0 ? 'No jobs posted yet' : 'No jobs found'}
            </CardTitle>
            <CardDescription>
              {jobs.length === 0
                ? 'Get started by creating your first job posting'
                : 'Try adjusting your search criteria or clearing filters'}
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            {jobs.length === 0 ? (
              <Button asChild>
                <Link href="/jobs/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Your First Job
                </Link>
              </Button>
            ) : (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <Badge className={getStatusColor(job.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(job.status)}
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <Badge variant="secondary">{getJobTypeLabel(job.jobType)}</Badge>
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location.city}, {job.location.country}
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
                        <Link href={`/jobs/${job.id}`} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Job
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/jobs/${job.id}/edit`} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Job
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {job.status !== JobStatus.published && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(job.id, JobStatus.published)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Publish Job
                        </DropdownMenuItem>
                      )}
                      {job.status === JobStatus.published && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(job.id, JobStatus.closed)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Close Job
                        </DropdownMenuItem>
                      )}
                      {job.status !== JobStatus.archived && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(job.id, JobStatus.archived)}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archive Job
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
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

              <CardContent>
                <CardDescription className="mb-4 line-clamp-2">
                  {job.description}
                </CardDescription>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.specialties?.slice(0, 3).map((specialty) => (
                    <Badge key={specialty.id} variant="outline">
                      {specialty.name}
                    </Badge>
                  ))}
                  {job.specialties && job.specialties.length > 3 && (
                    <Badge variant="outline">+{job.specialties.length - 3} more</Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <DollarSign className="h-4 w-4" />
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {job.viewCount} views
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Posted {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" className="flex-1 md:flex-none">
                  <Link href={`/applications?job=${job.id}`}>
                    <Users className="mr-2 h-4 w-4" />
                    View Applications
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 md:flex-none">
                  <Link href={`/jobs/${job.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job posting and all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => jobToDelete && handleDeleteJob(jobToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
