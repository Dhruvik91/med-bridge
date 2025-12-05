'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase } from 'lucide-react';
import { useGetJobs } from '@/hooks/get/useGetJobs';
import { useAuth } from '@/providers/auth-provider';
import { useJobFormatters } from '@/hooks/useJobFormatters';
import { Job, JobType, JobStatus } from '@/types';
import { JobSearchFilters } from '../components/JobSearchFilters';
import { JobCard } from '../components/JobCard';
import { EmptyState } from '../components/EmptyState';

export const JobsBrowse = () => {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [jobType, setJobType] = useState<JobType | 'all'>('all');

    const { profile } = useAuth();
    const { data: jobs = [], isLoading } = useGetJobs();
    const { formatSalary, getJobTypeLabel, formatDate } = useJobFormatters();

    const filteredJobs = useMemo(() => {
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

        return filtered;
    }, [jobs, searchQuery, location, jobType]);

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setLocation('');
        setJobType('all');
    }, []);

    const showClearButton = !!(searchQuery || location || jobType !== 'all');

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
            <JobSearchFilters
                searchQuery={searchQuery}
                location={location}
                jobType={jobType}
                onSearchChange={setSearchQuery}
                onLocationChange={setLocation}
                onJobTypeChange={setJobType}
                onClearFilters={handleClearFilters}
                showClearButton={showClearButton}
            />

            {/* Job Listings */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            ) : filteredJobs.length === 0 ? (
                <EmptyState
                    icon={Briefcase}
                    title="No jobs found"
                    description="Try adjusting your search criteria or clearing filters"
                    actionLabel="Clear Filters"
                    onAction={handleClearFilters}
                />
            ) : (
                <div className="space-y-6">
                    {filteredJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            userRole={profile?.role}
                            variant="browse"
                            formatSalary={formatSalary}
                            getJobTypeLabel={(type: string) => getJobTypeLabel(type as JobType)}
                            formatDate={formatDate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
