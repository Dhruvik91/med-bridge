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
    const [salaryMin, setSalaryMin] = useState<number | ''>('');
    const [salaryMax, setSalaryMax] = useState<number | ''>('');
    const [experienceMin, setExperienceMin] = useState<number | ''>('');
    const [experienceMax, setExperienceMax] = useState<number | ''>('');
    const [specialtyIds, setSpecialtyIds] = useState<string[]>([]);
    const [postedWithin, setPostedWithin] = useState<string | 'all'>('all');

    const { profile } = useAuth();
    const { data: jobsData, isLoading } = useGetJobs({
        q: searchQuery || undefined,
        location: location || undefined,
        jobType: jobType !== 'all' ? jobType : undefined,
        salaryMin: salaryMin || undefined,
        salaryMax: salaryMax || undefined,
        experienceMin: experienceMin || undefined,
        experienceMax: experienceMax || undefined,
        specialtyIds: specialtyIds.length > 0 ? specialtyIds : undefined,
        postedWithin: postedWithin !== 'all' ? postedWithin : undefined,
    });
    const { formatSalary, getJobTypeLabel, formatDate } = useJobFormatters();

    const filteredJobs = jobsData?.items ?? [];

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setLocation('');
        setJobType('all');
        setSalaryMin('');
        setSalaryMax('');
        setExperienceMin('');
        setExperienceMax('');
        setSpecialtyIds([]);
        setPostedWithin('all');
    }, []);

    const showClearButton = !!(searchQuery || location || jobType !== 'all' || salaryMin || salaryMax || experienceMin || experienceMax || specialtyIds.length > 0 || postedWithin !== 'all');

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
                                salaryMin={salaryMin}
                                salaryMax={salaryMax}
                                experienceMin={experienceMin}
                                experienceMax={experienceMax}
                                specialtyIds={specialtyIds}
                                postedWithin={postedWithin}
                                onSearchChange={setSearchQuery}
                                onLocationChange={setLocation}
                                onJobTypeChange={setJobType}
                                onSalaryMinChange={setSalaryMin}
                                onSalaryMaxChange={setSalaryMax}
                                onExperienceMinChange={setExperienceMin}
                                onExperienceMaxChange={setExperienceMax}
                                onSpecialtyIdsChange={setSpecialtyIds}
                                onPostedWithinChange={setPostedWithin}
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
                            salaryMin={salaryMin}
                            salaryMax={salaryMax}
                            experienceMin={experienceMin}
                            experienceMax={experienceMax}
                            specialtyIds={specialtyIds}
                            postedWithin={postedWithin}
                            onSearchChange={setSearchQuery}
                            onLocationChange={setLocation}
                            onJobTypeChange={setJobType}
                            onSalaryMinChange={setSalaryMin}
                            onSalaryMaxChange={setSalaryMax}
                            onExperienceMinChange={setExperienceMin}
                            onExperienceMaxChange={setExperienceMax}
                            onSpecialtyIdsChange={setSpecialtyIds}
                            onPostedWithinChange={setPostedWithin}
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
