'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { useJobFormatters } from '@/hooks/useJobFormatters';
import { SavedJobsLoading } from '../components/SavedJobsLoading';
import { SavedJobsUnauthenticated } from '../components/SavedJobsUnauthenticated';
import { SavedJobsEmptyState } from '../components/SavedJobsEmptyState';
import { SavedJobCard } from '../components/SavedJobCard';
import { MobileFilterDrawer } from '../../jobs/components/MobileFilterDrawer';
import { EmptyState } from '../../jobs/components/EmptyState';
import { Briefcase } from 'lucide-react';
import { JobFilters, createInitialJobFilters, hasActiveFilters } from '../../jobs/hooks/useJobFilters';
import { Button } from '@/components/ui/button';

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

    const initialFilters: JobFilters = createInitialJobFilters();

    // Draft filters used inside the drawer UI
    const [draftFilters, setDraftFilters] = useState<JobFilters>(initialFilters);

    // Applied filters used to actually filter the saved jobs list
    const [appliedFilters, setAppliedFilters] = useState<JobFilters>(initialFilters);

    const filteredSavedJobs = useMemo(() => {
        let filtered = savedJobs;

        if (appliedFilters.searchQuery) {
            const query = appliedFilters.searchQuery.toLowerCase();
            filtered = filtered.filter(savedJob =>
                savedJob.job?.title.toLowerCase().includes(query) ||
                savedJob.job?.description.toLowerCase().includes(query) ||
                savedJob.job?.specialties?.some(s => s.name.toLowerCase().includes(query))
            );
        }

        if (appliedFilters.location) {
            const loc = appliedFilters.location.toLowerCase();
            filtered = filtered.filter(savedJob =>
                savedJob.job?.location?.city.toLowerCase().includes(loc) ||
                savedJob.job?.location?.state?.toLowerCase().includes(loc) ||
                savedJob.job?.location?.country.toLowerCase().includes(loc)
            );
        }

        if (appliedFilters.jobType !== 'all') {
            filtered = filtered.filter(savedJob => savedJob.job?.jobType === appliedFilters.jobType);
        }

        if (appliedFilters.salaryMin !== '') {
            const min = appliedFilters.salaryMin;
            filtered = filtered.filter(savedJob => Number(savedJob.job?.salaryMin ?? 0) >= min);
        }

        if (appliedFilters.salaryMax !== '') {
            const max = appliedFilters.salaryMax;
            filtered = filtered.filter(savedJob => Number(savedJob.job?.salaryMax ?? Infinity) <= max);
        }

        if (appliedFilters.experienceMin !== '') {
            const minExp = appliedFilters.experienceMin;
            filtered = filtered.filter(savedJob => Number(savedJob.job?.experienceMin ?? 0) >= minExp);
        }

        if (appliedFilters.experienceMax !== '') {
            const maxExp = appliedFilters.experienceMax;
            filtered = filtered.filter(savedJob => Number(savedJob.job?.experienceMax ?? Infinity) <= maxExp);
        }

        if (appliedFilters.specialtyIds.length > 0) {
            filtered = filtered.filter(savedJob =>
                savedJob.job?.specialties?.some(s => appliedFilters.specialtyIds.includes(s.id))
            );
        }

        if (appliedFilters.postedWithin !== 'all') {
            const now = new Date();
            const hours = appliedFilters.postedWithin === '24h'
                ? 24
                : appliedFilters.postedWithin === '7d'
                    ? 24 * 7
                    : 24 * 30;
            const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
            filtered = filtered.filter(savedJob => new Date(savedJob.job?.createdAt || '') >= cutoff);
        }

        return filtered;
    }, [savedJobs, appliedFilters]);

    const handleApplyFilters = useCallback(() => {
        setAppliedFilters(draftFilters);
    }, [draftFilters]);

    const handleClearFilters = useCallback(() => {
        const cleared: JobFilters = {
            searchQuery: '',
            location: '',
            jobType: 'all',
            salaryMin: '',
            salaryMax: '',
            experienceMin: '',
            experienceMax: '',
            specialtyIds: [],
            postedWithin: 'all',
        };

        setDraftFilters(cleared);
        setAppliedFilters(cleared);
    }, []);

    const showClearButton = hasActiveFilters(draftFilters);

    const hasAppliedFilters = hasActiveFilters(appliedFilters);

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

                        {/* Filters Button - opens drawer on all screen sizes */}
                        <div className="flex items-center gap-2">
                            <MobileFilterDrawer
                                searchQuery={draftFilters.searchQuery}
                                location={draftFilters.location}
                                jobType={draftFilters.jobType}
                                salaryMin={draftFilters.salaryMin}
                                salaryMax={draftFilters.salaryMax}
                                experienceMin={draftFilters.experienceMin}
                                experienceMax={draftFilters.experienceMax}
                                specialtyIds={draftFilters.specialtyIds}
                                postedWithin={draftFilters.postedWithin}
                                onSearchChange={(value) =>
                                    setDraftFilters((prev) => ({ ...prev, searchQuery: value }))
                                }
                                onLocationChange={(value) =>
                                    setDraftFilters((prev) => ({ ...prev, location: value }))
                                }
                                onJobTypeChange={(value) =>
                                    setDraftFilters((prev) => ({ ...prev, jobType: value }))
                                }
                                onSalaryMinChange={(value) =>
                                    setDraftFilters((prev) => ({ ...prev, salaryMin: value }))
                                }
                                onSalaryMaxChange={(value) =>
                                    setDraftFilters((prev) => ({ ...prev, salaryMax: value }))
                                }
                                onExperienceMinChange={(value) =>
                                    setDraftFilters((prev) => ({ ...prev, experienceMin: value }))
                                }
                                onExperienceMaxChange={(value) =>
                                    setDraftFilters((prev) => ({ ...prev, experienceMax: value }))
                                }
                                onSpecialtyIdsChange={(value) =>
                                    setDraftFilters((prev) => ({ ...prev, specialtyIds: value }))
                                }
                                onPostedWithinChange={(value) =>
                                    setDraftFilters((prev) => ({ ...prev, postedWithin: value }))
                                }
                                onClearFilters={handleClearFilters}
                                showClearButton={showClearButton}
                                onApply={handleApplyFilters}
                            />

                            {hasAppliedFilters && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearFilters}
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
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
