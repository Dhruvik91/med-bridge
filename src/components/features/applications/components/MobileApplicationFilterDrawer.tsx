'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal } from 'lucide-react';
import { ApplicationStatus } from '@/types';

interface MobileApplicationFilterDrawerProps {
    statusFilter: ApplicationStatus | 'all';
    sortBy: 'recent' | 'oldest';
    onStatusChange: (value: ApplicationStatus | 'all') => void;
    onSortChange: (value: 'recent' | 'oldest') => void;
    onClearFilters: () => void;
    showClearButton: boolean;
}

export const MobileApplicationFilterDrawer = ({
    statusFilter,
    sortBy,
    onStatusChange,
    onSortChange,
    onClearFilters,
    showClearButton,
}: MobileApplicationFilterDrawerProps) => {
    const [open, setOpen] = useState(false);

    // Count active filters
    const activeFilterCount = [
        statusFilter !== 'all' ? statusFilter : null,
        sortBy !== 'recent' ? sortBy : null,
    ].filter(Boolean).length;

    const handleApplyFilters = () => {
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
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
            <SheetContent side="top" className="h-auto max-h-[80vh] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Filter Applications</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                    {/* Status Filter */}
                    <div className="space-y-2">
                        <label htmlFor="mobile-status" className="text-sm font-medium">
                            Filter by Status
                        </label>
                        <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as ApplicationStatus | 'all')}>
                            <SelectTrigger id="mobile-status">
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

                    {/* Sort By */}
                    <div className="space-y-2">
                        <label htmlFor="mobile-sort" className="text-sm font-medium">
                            Sort by
                        </label>
                        <Select value={sortBy} onValueChange={(value) => onSortChange(value as 'recent' | 'oldest')}>
                            <SelectTrigger id="mobile-sort">
                                <SelectValue />
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
                        {showClearButton && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    onClearFilters();
                                    setOpen(false);
                                }}
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
