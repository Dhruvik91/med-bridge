'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Filter, SlidersHorizontal } from 'lucide-react';
import { JobType } from '@/types';

interface MobileFilterDrawerProps {
    searchQuery: string;
    location: string;
    jobType: JobType | 'all';
    onSearchChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onJobTypeChange: (value: JobType | 'all') => void;
    onClearFilters: () => void;
    showClearButton: boolean;
}

export const MobileFilterDrawer = ({
    searchQuery,
    location,
    jobType,
    onSearchChange,
    onLocationChange,
    onJobTypeChange,
    onClearFilters,
    showClearButton,
}: MobileFilterDrawerProps) => {
    const [open, setOpen] = useState(false);

    // Count active filters
    const activeFilterCount = [
        searchQuery,
        location,
        jobType !== 'all' ? jobType : null,
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
                    <SheetTitle>Filter Jobs</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                    {/* Job Title Search */}
                    <div className="space-y-2">
                        <label htmlFor="mobile-search" className="text-sm font-medium">
                            Job Title
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="mobile-search"
                                type="text"
                                placeholder="Job title, specialty, or keyword"
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Location Search */}
                    <div className="space-y-2">
                        <label htmlFor="mobile-location" className="text-sm font-medium">
                            Location
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="mobile-location"
                                type="text"
                                placeholder="City, state, or country"
                                className="pl-10"
                                value={location}
                                onChange={(e) => onLocationChange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Job Type Select */}
                    <div className="space-y-2">
                        <label htmlFor="mobile-job-type" className="text-sm font-medium">
                            Job Type
                        </label>
                        <Select value={jobType} onValueChange={(value) => onJobTypeChange(value as JobType | 'all')}>
                            <SelectTrigger id="mobile-job-type">
                                <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value={JobType.full_time}>Full Time</SelectItem>
                                <SelectItem value={JobType.part_time}>Part Time</SelectItem>
                                <SelectItem value={JobType.contract}>Contract</SelectItem>
                                <SelectItem value={JobType.temporary}>Temporary</SelectItem>
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
