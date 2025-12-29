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
import { JobFilters, createInitialJobFilters, hasActiveFilters } from '../../jobs/hooks/useJobFilters';

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

    const [filters, setFilters] = useState<JobFilters>(() => createInitialJobFilters());

    const filteredSavedJobs = useMemo(() => {
        let filtered = savedJobs;

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(savedJob =>
                savedJob.job?.title.toLowerCase().includes(query) ||
                savedJob.job?.description.toLowerCase().includes(query) ||
                savedJob.job?.specialties?.some(s => s.name.toLowerCase().includes(query))
            );
        }

        if (filters.location) {
            const loc = filters.location.toLowerCase();
            filtered = filtered.filter(savedJob =>
                savedJob.job?.location?.city.toLowerCase().includes(loc) ||
                savedJob.job?.location?.state?.toLowerCase().includes(loc) ||
                savedJob.job?.location?.country.toLowerCase().includes(loc)
            );
        }

        if (filters.jobType !== 'all') {
            filtered = filtered.filter(savedJob => savedJob.job?.jobType === filters.jobType);
        }

        if (filters.salaryMin !== '') {
            const min = filters.salaryMin;
            filtered = filtered.filter(savedJob => Number(savedJob.job?.salaryMin ?? 0) >= min);
        }

        if (filters.salaryMax !== '') {
            const max = filters.salaryMax;
            filtered = filtered.filter(savedJob => Number(savedJob.job?.salaryMax ?? Infinity) <= max);
        }

        if (filters.experienceMin !== '') {
            const minExp = filters.experienceMin;
            filtered = filtered.filter(savedJob => Number(savedJob.job?.experienceMin ?? 0) >= minExp);
        }

        if (filters.experienceMax !== '') {
            const maxExp = filters.experienceMax;
            filtered = filtered.filter(savedJob => Number(savedJob.job?.experienceMax ?? Infinity) <= maxExp);
        }

        if (filters.specialtyIds.length > 0) {
            filtered = filtered.filter(savedJob =>
                savedJob.job?.specialties?.some(s => filters.specialtyIds.includes(s.id))
            );
        }

        if (filters.postedWithin !== 'all') {
            const now = new Date();
            const hours = filters.postedWithin === '24h' ? 24 : filters.postedWithin === '7d' ? 24 * 7 : 24 * 30;
            const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
            filtered = filtered.filter(savedJob => new Date(savedJob.job?.createdAt || '') >= cutoff);
        }

        return filtered;
    }, [savedJobs, filters]);

    const handleClearFilters = useCallback(() => {
        setFilters(createInitialJobFilters());
    }, []);

    const showClearButton = hasActiveFilters(filters);

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
                                searchQuery={filters.searchQuery}
                                location={filters.location}
                                jobType={filters.jobType}
                                salaryMin={filters.salaryMin}
                                salaryMax={filters.salaryMax}
                                experienceMin={filters.experienceMin}
                                experienceMax={filters.experienceMax}
                                specialtyIds={filters.specialtyIds}
                                postedWithin={filters.postedWithin}
                                onSearchChange={(value) => setFilters(prev => ({ ...prev, searchQuery: value }))}
                                onLocationChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                                onJobTypeChange={(value) => setFilters(prev => ({ ...prev, jobType: value }))}
                                onSalaryMinChange={(value) => setFilters(prev => ({ ...prev, salaryMin: value }))}
                                onSalaryMaxChange={(value) => setFilters(prev => ({ ...prev, salaryMax: value }))}
                                onExperienceMinChange={(value) => setFilters(prev => ({ ...prev, experienceMin: value }))}
                                onExperienceMaxChange={(value) => setFilters(prev => ({ ...prev, experienceMax: value }))}
                                onSpecialtyIdsChange={(value) => setFilters(prev => ({ ...prev, specialtyIds: value }))}
                                onPostedWithinChange={(value) => setFilters(prev => ({ ...prev, postedWithin: value }))}
                                onClearFilters={handleClearFilters}
                                showClearButton={showClearButton}
                            />
                        </div>
                    </div>

                    {/* Desktop Filters - Inline */}
                    <div className="mt-4">
                        <JobSearchFilters
                            searchQuery={filters.searchQuery}
                            location={filters.location}
                            jobType={filters.jobType}
                            salaryMin={filters.salaryMin}
                            salaryMax={filters.salaryMax}
                            experienceMin={filters.experienceMin}
                            experienceMax={filters.experienceMax}
                            specialtyIds={filters.specialtyIds}
                            postedWithin={filters.postedWithin}
                            onSearchChange={(value) => setFilters(prev => ({ ...prev, searchQuery: value }))}
                            onLocationChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                            onJobTypeChange={(value) => setFilters(prev => ({ ...prev, jobType: value }))}
                            onSalaryMinChange={(value) => setFilters(prev => ({ ...prev, salaryMin: value }))}
                            onSalaryMaxChange={(value) => setFilters(prev => ({ ...prev, salaryMax: value }))}
                            onExperienceMinChange={(value) => setFilters(prev => ({ ...prev, experienceMin: value }))}
                            onExperienceMaxChange={(value) => setFilters(prev => ({ ...prev, experienceMax: value }))}
                            onSpecialtyIdsChange={(value) => setFilters(prev => ({ ...prev, specialtyIds: value }))}
                            onPostedWithinChange={(value) => setFilters(prev => ({ ...prev, postedWithin: value }))}
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
