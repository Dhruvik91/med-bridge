'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SlidersHorizontal, Search } from 'lucide-react';
import { ApplicationStatus, Job } from '@/types';

interface MobileApplicationFilterDrawerProps {
    searchQuery?: string;
    setSearchQuery?: (value: string) => void;
    jobFilter?: string;
    setJobFilter?: (value: string) => void;
    statusFilter: ApplicationStatus | 'all';
    setStatusFilter: (value: ApplicationStatus | 'all') => void;
    sortBy: 'recent' | 'oldest';
    setSortBy: (value: 'recent' | 'oldest') => void;
    jobs?: Job[];
    onClearFilters?: () => void;
    showClearButton?: boolean;
}

export const MobileApplicationFilterDrawer = ({
    searchQuery,
    setSearchQuery,
    jobFilter,
    setJobFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    jobs,
    onClearFilters,
    showClearButton,
}: MobileApplicationFilterDrawerProps) => {
    const [open, setOpen] = useState(false);

    // Count active filters
    const activeFilterCount = [
        searchQuery ? 'search' : null,
        statusFilter !== 'all' ? statusFilter : null,
        jobFilter && jobFilter !== 'all' ? jobFilter : null,
        sortBy !== 'recent' ? sortBy : null,
    ].filter(Boolean).length;

    const handleClearFilters = () => {
        if (onClearFilters) {
            onClearFilters();
        } else {
            if (setSearchQuery) setSearchQuery('');
            setStatusFilter('all');
            if (setJobFilter) setJobFilter('all');
            setSortBy('recent');
        }
        setOpen(false);
    };

    const handleApplyFilters = () => {
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm" className="relative">
                    <SlidersHorizontal className="h-4 w-4" />
                    {activeFilterCount > 0 && (
                        <Badge
                            variant="default"
                            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-auto max-h-[80vh] overflow-y-auto glass-enhanced">
                <SheetHeader>
                    <SheetTitle>Filter Applications</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                    {/* Search - Only if setSearchQuery is provided */}
                    {setSearchQuery && (
                        <div className="space-y-2">
                            <label htmlFor="mobile-search" className="text-sm font-medium">
                                Search Candidate
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    id="mobile-search"
                                    type="text"
                                    placeholder="Search by name..."
                                    className="pl-10 h-11 text-sm"
                                    value={searchQuery || ''}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Job Filter - Only if setJobFilter and jobs are provided */}
                    {setJobFilter && jobs && (
                        <div className="space-y-2">
                            <label htmlFor="mobile-job" className="text-sm font-medium">
                                Filter by Job
                            </label>
                            <Select value={jobFilter || 'all'} onValueChange={setJobFilter}>
                                <SelectTrigger id="mobile-job" className="h-11">
                                    <SelectValue placeholder="All Jobs" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Jobs</SelectItem>
                                    {jobs.map((job) => (
                                        <SelectItem key={job.id} value={job.id}>
                                            {job.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Status Filter */}
                    <div className="space-y-2">
                        <label htmlFor="mobile-status" className="text-sm font-medium">
                            Filter by Status
                        </label>
                        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}>
                            <SelectTrigger id="mobile-status" className="h-11">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {Object.values(ApplicationStatus).map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                        <label htmlFor="mobile-sort" className="text-sm font-medium">
                            Sort By
                        </label>
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'recent' | 'oldest')}>
                            <SelectTrigger id="mobile-sort" className="h-11">
                                <SelectValue placeholder="Sort order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Most Recent</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleApplyFilters}
                            className="flex-1"
                        >
                            Apply Filters
                        </Button>
                        {(activeFilterCount > 0 || showClearButton) && (
                            <Button
                                variant="outline"
                                onClick={handleClearFilters}
                                className="flex-1"
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
