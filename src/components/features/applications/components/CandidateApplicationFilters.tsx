import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApplicationStatus } from '@/types';

interface CandidateApplicationFiltersProps {
    statusFilter: ApplicationStatus | 'all';
    setStatusFilter: (status: ApplicationStatus | 'all') => void;
    sortBy: 'recent' | 'oldest';
    setSortBy: (sort: 'recent' | 'oldest') => void;
    onClearFilters: () => void;
    showClearButton: boolean;
}

export function CandidateApplicationFilters({
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    onClearFilters,
    showClearButton,
}: CandidateApplicationFiltersProps) {
    return (
        <div className="hidden md:flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Filter by Status</label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Applications" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Applications</SelectItem>
                        <SelectItem value={ApplicationStatus.applied}>Pending Review</SelectItem>
                        <SelectItem value={ApplicationStatus.viewed}>Viewed</SelectItem>
                        <SelectItem value={ApplicationStatus.shortlisted}>Shortlisted</SelectItem>
                        <SelectItem value={ApplicationStatus.interview}>Interview</SelectItem>
                        <SelectItem value={ApplicationStatus.offer}>Offer</SelectItem>
                        <SelectItem value={ApplicationStatus.hired}>Hired</SelectItem>
                        <SelectItem value={ApplicationStatus.rejected}>Rejected</SelectItem>
                        <SelectItem value={ApplicationStatus.withdrawn}>Withdrawn</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Sort by</label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'recent' | 'oldest')}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {showClearButton && (
                <Button variant="outline" onClick={onClearFilters}>
                    Clear Filters
                </Button>
            )}
        </div>
    );
}
