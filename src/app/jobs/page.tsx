'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock,
  Building2,
  Filter,
  X
} from 'lucide-react';
import { useGetJobs } from '@/hooks/get/useGetJobs';
import { Job, JobType, JobStatus } from '@/types';

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState<JobType | 'all'>('all');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  const { data: jobs = [], isLoading } = useGetJobs();

  useEffect(() => {
    let filtered = jobs.filter(job => job.status === JobStatus.published);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.specialties?.some(s => s.name.toLowerCase().includes(query))
      );
    }

    if (location) {
      const loc = location.toLowerCase();
      filtered = filtered.filter(job =>
        job.location?.city.toLowerCase().includes(loc) ||
        job.location?.state?.toLowerCase().includes(loc) ||
        job.location?.country.toLowerCase().includes(loc)
      );
    }

    if (jobType !== 'all') {
      filtered = filtered.filter(job => job.jobType === jobType);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, location, jobType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtering is handled by useEffect
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setJobType('all');
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `From $${(min / 1000).toFixed(0)}k`;
    return `Up to $${(max! / 1000).toFixed(0)}k`;
  };

  const getJobTypeLabel = (type: JobType) => {
    return type.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Healthcare Jobs</h1>
        <p className="text-muted-foreground">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" aria-hidden="true" />
                <Input
                  type="text"
                  placeholder="Job title, specialty, or keyword"
                  className="pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search jobs"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" aria-hidden="true" />
                <Input
                  type="text"
                  placeholder="City, state, or country"
                  className="pl-12"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  aria-label="Location"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select value={jobType} onValueChange={(value) => setJobType(value as JobType | 'all')}>
                <SelectTrigger className="w-[180px]" aria-label="Job type filter">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={JobType.full_time}>Full Time</SelectItem>
                  <SelectItem value={JobType.part_time}>Part Time</SelectItem>
                  <SelectItem value={JobType.contract}>Contract</SelectItem>
                  <SelectItem value={JobType.temporary}>Temporary</SelectItem>
                  <SelectItem value={JobType.remote}>Remote</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || location || jobType !== 'all') && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  <X className="mr-2 h-4 w-4" aria-hidden="true" />
                  Clear Filters
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Job Listings */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="text-center py-16">
          <CardHeader>
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
            <CardTitle>No jobs found</CardTitle>
            <CardDescription>
              Try adjusting your search criteria or clearing filters
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/jobs/${job.id}`} className="hover:underline">
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" aria-hidden="true" />
                        {job.organization?.name || job.employerProfile?.name || 'Healthcare Facility'}
                      </span>
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" aria-hidden="true" />
                          {job.location.city}, {job.location.country}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary">{getJobTypeLabel(job.jobType)}</Badge>
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
                    <DollarSign className="h-4 w-4" aria-hidden="true" />
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    Posted {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button asChild className="flex-1 md:flex-none">
                  <Link href={`/jobs/${job.id}`}>View Details</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 md:flex-none">
                  <Link href={`/jobs/${job.id}#apply`}>Quick Apply</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
