'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteJobs } from '@/hooks/get/useInfiniteJobs';
import { useAuth } from '@/providers/auth-provider';
import { useJobFormatters } from '@/hooks/useJobFormatters';
import { JobType } from '@/types';
import { MobileFilterDrawer } from '../components/MobileFilterDrawer';
import { JobCard } from '../components/JobCard';
import { EmptyState } from '../components/EmptyState';
import { JobFilters, createInitialJobFilters, hasActiveFilters } from '../hooks/useJobFilters';

export const JobsBrowse = () => {
    const searchParams = useSearchParams();

    const initialFilters: JobFilters = createInitialJobFilters({
        searchQuery: searchParams.get('q') || '',
        location: searchParams.get('location') || '',
    });

    // Draft filter state (used in the UI while the drawer is open)
    const [draftFilters, setDraftFilters] = useState<JobFilters>(initialFilters);

    // Applied filter state (used to query the API)
    const [appliedFilters, setAppliedFilters] = useState<JobFilters>(initialFilters);

    const { profile } = useAuth();

    const queryParams = useMemo(
        () => ({
            q: appliedFilters.searchQuery || undefined,
            location: appliedFilters.location || undefined,
            jobType: appliedFilters.jobType !== 'all' ? appliedFilters.jobType : undefined,
            salaryMin: appliedFilters.salaryMin || undefined,
            salaryMax: appliedFilters.salaryMax || undefined,
            experienceMin: appliedFilters.experienceMin || undefined,
            experienceMax: appliedFilters.experienceMax || undefined,
            specialtyIds:
                appliedFilters.specialtyIds.length > 0 ? appliedFilters.specialtyIds : undefined,
            postedWithin:
                appliedFilters.postedWithin !== 'all' ? appliedFilters.postedWithin : undefined,
        }),
        [appliedFilters],
    );

    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
    } = useInfiniteJobs(queryParams, 12);
    const { formatSalary, getJobTypeLabel, formatDate } = useJobFormatters();

    const jobs = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);
    const total = data?.pages?.[0]?.total ?? 0;

    const { ref: sentinelRef, inView } = useInView({
        root: null,
        rootMargin: '400px',
        threshold: 0,
    });

    useEffect(() => {
        if (!inView) return;
        if (!hasNextPage) return;
        if (isFetchingNextPage) return;
        fetchNextPage();
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

    const handleApplyFilters = useCallback(() => {
        // Apply the current draft filter values to trigger the API call
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

        // Reset draft and applied filters (this will trigger the API with cleared filters)
        setDraftFilters(cleared);
        setAppliedFilters(cleared);
    }, []);

    const showClearButton = hasActiveFilters(draftFilters);

    const hasAppliedFilters = hasActiveFilters(appliedFilters);

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
                                {total > 0 ? (
                                    <>
                                        Showing {jobs.length} of {total} {total === 1 ? 'job' : 'jobs'}
                                    </>
                                ) : (
                                    <>
                                        {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
                                    </>
                                )}
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
                            {showClearButton && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearFilters}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* All filters are now inside the Filters drawer */}
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
                    ) : isError ? (
                        <EmptyState
                            icon={Briefcase}
                            title="Something went wrong"
                            description="We couldn't load jobs right now. Please try again."
                        />
                    ) : jobs.length === 0 ? (
                        hasAppliedFilters ? (
                            <EmptyState
                                icon={Briefcase}
                                title="No jobs found"
                                description="Try adjusting your search criteria or clearing filters"
                                actionLabel="Clear Filters"
                                onAction={handleClearFilters}
                            />
                        ) : (
                            <EmptyState
                                icon={Briefcase}
                                title="Coming soon"
                                description="We are working hard to bring you opportunities. Please check back later."
                            />
                        )
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {jobs.map((job) => (
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

                            <div ref={sentinelRef} className="h-8" />

                            {isFetchingNextPage && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-64" />
                                    ))}
                                </div>
                            )}

                            {!hasNextPage && total > 0 && jobs.length >= total && (
                                <div className="mt-6 text-center text-sm text-muted-foreground">
                                    You've reached the end.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
