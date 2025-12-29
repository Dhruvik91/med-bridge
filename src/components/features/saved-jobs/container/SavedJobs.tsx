'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { useJobFormatters } from '@/hooks/useJobFormatters';
import { SavedJobsLoading } from '../components/SavedJobsLoading';
import { SavedJobsUnauthenticated } from '../components/SavedJobsUnauthenticated';
import { SavedJobsEmptyState } from '../components/SavedJobsEmptyState';
import { SavedJobCard } from '../components/SavedJobCard';
import { JobSearchFilters } from '../../jobs/components/JobSearchFilters';
import { MobileFilterDrawer } from '../../jobs/components/MobileFilterDrawer';
import { EmptyState } from '../../jobs/components/EmptyState';
import { Briefcase } from 'lucide-react';
import { JobType } from '@/types';

export function SavedJobs() {
    const {
        user,
        userLoading,
        savedJobs,
        savedJobsLoading,
        deletingJobId,
        handleUnsaveJob,
    } = useSavedJobs();

    const { formatSalary, getJobTypeLabel, formatDate } = useJobFormatters();

    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState<JobType | 'all'>('all');
    const [salaryMin, setSalaryMin] = useState<number | ''>('');
    const [salaryMax, setSalaryMax] = useState<number | ''>('');
    const [experienceMin, setExperienceMin] = useState<number | ''>('');
    const [experienceMax, setExperienceMax] = useState<number | ''>('');
    const [specialtyIds, setSpecialtyIds] = useState<string[]>([]);
    const [postedWithin, setPostedWithin] = useState<string | 'all'>('all');

    const filteredSavedJobs = useMemo(() => {
        let filtered = savedJobs;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(savedJob =>
                savedJob.job?.title.toLowerCase().includes(query) ||
                savedJob.job?.description.toLowerCase().includes(query) ||
                savedJob.job?.specialties?.some(s => s.name.toLowerCase().includes(query))
            );
        }

        if (location) {
            const loc = location.toLowerCase();
            filtered = filtered.filter(savedJob =>
                savedJob.job?.location?.city.toLowerCase().includes(loc) ||
                savedJob.job?.location?.state?.toLowerCase().includes(loc) ||
                savedJob.job?.location?.country.toLowerCase().includes(loc)
            );
        }

        if (jobType !== 'all') {
            filtered = filtered.filter(savedJob => savedJob.job?.jobType === jobType);
        }

        if (salaryMin !== '') {
            filtered = filtered.filter(savedJob => Number(savedJob.job?.salaryMin ?? 0) >= salaryMin);
        }

        if (salaryMax !== '') {
            filtered = filtered.filter(savedJob => Number(savedJob.job?.salaryMax ?? Infinity) <= salaryMax);
        }

        if (experienceMin !== '') {
            filtered = filtered.filter(savedJob => Number(savedJob.job?.experienceMin ?? 0) >= experienceMin);
        }

        if (experienceMax !== '') {
            filtered = filtered.filter(savedJob => Number(savedJob.job?.experienceMax ?? Infinity) <= experienceMax);
        }

        if (specialtyIds.length > 0) {
            filtered = filtered.filter(savedJob =>
                savedJob.job?.specialties?.some(s => specialtyIds.includes(s.id))
            );
        }

        if (postedWithin !== 'all') {
            const now = new Date();
            const hours = postedWithin === '24h' ? 24 : postedWithin === '7d' ? 24 * 7 : 24 * 30;
            const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
            filtered = filtered.filter(savedJob => new Date(savedJob.job?.createdAt || '') >= cutoff);
        }

        return filtered;
    }, [savedJobs, searchQuery, location, jobType, salaryMin, salaryMax, experienceMin, experienceMax, specialtyIds, postedWithin]);

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

    const showClearButton = !!(
        searchQuery ||
        location ||
        jobType !== 'all' ||
        salaryMin !== '' ||
        salaryMax !== '' ||
        experienceMin !== '' ||
        experienceMax !== '' ||
        specialtyIds.length > 0 ||
        postedWithin !== 'all'
    );

    // Loading state
    if (userLoading || savedJobsLoading) {
        return <SavedJobsLoading />;
    }

    // Unauthenticated state
    if (!user) {
        return <SavedJobsUnauthenticated />;
    }

    // If user has no saved jobs at all (after filtering out deleted ones)
    if (savedJobs.length === 0) {
        return (
            <div className="flex flex-col h-[calc(100vh-4rem)]">
                {/* Fixed Header - Sticky on Desktop */}
                <div className="sticky top-0 z-10 bg-background border-b">
                    <div className="container mx-auto px-4 py-4 md:py-6">
                        <div className="flex items-center justify-between mb-4 md:mb-0">
                            <div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
                                    Saved Jobs
                                </h1>
                                <p className="text-sm md:text-base text-muted-foreground">
                                    0 jobs saved
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Empty State Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="container mx-auto px-4 py-8">
                        <SavedJobsEmptyState />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Fixed Header - Sticky on Desktop */}
            <div className="sticky top-0 z-10 bg-background border-b">
                <div className="container mx-auto px-4 py-4 md:py-6">
                    <div className="flex items-center justify-between mb-4 md:mb-0">
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">
                                Saved Jobs
                            </h1>
                            <p className="text-sm md:text-base text-muted-foreground">
                                {filteredSavedJobs.length} {filteredSavedJobs.length === 1 ? 'job' : 'jobs'} saved
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
                    {filteredSavedJobs.length === 0 ? (
                        <EmptyState
                            icon={Briefcase}
                            title="No saved jobs found"
                            description="Try adjusting your search criteria or clearing filters"
                            actionLabel="Clear Filters"
                            onAction={handleClearFilters}
                        />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredSavedJobs.map((savedJob) => (
                                    <SavedJobCard
                                        key={savedJob.id}
                                        savedJob={savedJob}
                                        onUnsave={handleUnsaveJob}
                                        isDeleting={deletingJobId === savedJob.job?.id}
                                        formatSalary={formatSalary}
                                        getJobTypeLabel={getJobTypeLabel}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
