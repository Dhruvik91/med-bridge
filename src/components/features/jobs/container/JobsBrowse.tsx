'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase } from 'lucide-react';
import { useGetJobs } from '@/hooks/get/useGetJobs';
import { useAuth } from '@/providers/auth-provider';
import { useJobFormatters } from '@/hooks/useJobFormatters';
import { JobType, JobStatus } from '@/types';
import { JobSearchFilters } from '../components/JobSearchFilters';
import { MobileFilterDrawer } from '../components/MobileFilterDrawer';
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
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Fixed Header - Sticky on Desktop */}
            <div className="sticky top-0 z-10 bg-background border-b">
                <div className="container mx-auto px-4 py-4 md:py-6">
                    <div className="flex items-center justify-between mb-4 md:mb-0">
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
                                Browse Jobs
                            </h1>
                            <p className="text-sm md:text-base text-muted-foreground">
                                {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
                            </p>
                        </div>

                        {/* Mobile Filter Button */}
                        <div className="md:hidden">
                            <MobileFilterDrawer
                                searchQuery={searchQuery}
                                location={location}
                                jobType={jobType}
                                onSearchChange={setSearchQuery}
                                onLocationChange={setLocation}
                                onJobTypeChange={setJobType}
                                onClearFilters={handleClearFilters}
                                showClearButton={showClearButton}
                            />
                        </div>
                    </div>

                    {/* Desktop Filters - Inline */}
                    <div className="mt-4">
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
                    </div>
                </div>
            </div>

            {/* Scrollable Job Listings */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 py-6">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
            </div>
        </div>
    );
};
