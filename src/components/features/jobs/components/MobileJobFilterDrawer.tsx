'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SlidersHorizontal, Search } from 'lucide-react';
import { JobStatus } from '@/types';

interface MobileJobFilterDrawerProps {
    searchQuery: string;
    statusFilter: JobStatus | 'all';
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: JobStatus | 'all') => void;
    onClearFilters: () => void;
    showClearButton: boolean;
}

export const MobileJobFilterDrawer = ({
    searchQuery,
    statusFilter,
    onSearchChange,
    onStatusFilterChange,
    onClearFilters,
    showClearButton,
}: MobileJobFilterDrawerProps) => {
    const [open, setOpen] = useState(false);

    // Count active filters
    const activeFilterCount = [
        searchQuery ? 'search' : null,
        statusFilter !== 'all' ? statusFilter : null,
    ].filter(Boolean).length;

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
                    <SheetTitle>Filter Jobs</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                    {/* Search */}
                    <div className="space-y-2">
                        <label htmlFor="mobile-search" className="text-sm font-medium">
                            Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="mobile-search"
                                type="text"
                                placeholder="Search job title..."
                                className="pl-10 h-11 text-sm"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                        <label htmlFor="mobile-status" className="text-sm font-medium">
                            Filter by Status
                        </label>
                        <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as JobStatus | 'all')}>
                            <SelectTrigger id="mobile-status" className="h-11">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value={JobStatus.published}>Published</SelectItem>
                                <SelectItem value={JobStatus.draft}>Draft</SelectItem>
                                <SelectItem value={JobStatus.closed}>Closed</SelectItem>
                                <SelectItem value={JobStatus.archived}>Archived</SelectItem>
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
