'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Filter, SlidersHorizontal } from 'lucide-react';
import { JobType } from '@/types';
import { SpecialtySelector } from './SpecialtySelector';

interface MobileFilterDrawerProps {
    searchQuery: string;
    location: string;
    jobType: JobType | 'all';
    salaryMin: number | '';
    salaryMax: number | '';
    experienceMin: number | '';
    experienceMax: number | '';
    specialtyIds: string[];
    postedWithin: string | 'all';
    onSearchChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onJobTypeChange: (value: JobType | 'all') => void;
    onSalaryMinChange: (value: number | '') => void;
    onSalaryMaxChange: (value: number | '') => void;
    onExperienceMinChange: (value: number | '') => void;
    onExperienceMaxChange: (value: number | '') => void;
    onSpecialtyIdsChange: (value: string[]) => void;
    onPostedWithinChange: (value: string | 'all') => void;
    onClearFilters: () => void;
    showClearButton: boolean;
}

export const MobileFilterDrawer = ({
    searchQuery,
    location,
    jobType,
    salaryMin,
    salaryMax,
    experienceMin,
    experienceMax,
    specialtyIds,
    postedWithin,
    onSearchChange,
    onLocationChange,
    onJobTypeChange,
    onSalaryMinChange,
    onSalaryMaxChange,
    onExperienceMinChange,
    onExperienceMaxChange,
    onSpecialtyIdsChange,
    onPostedWithinChange,
    onClearFilters,
    showClearButton,
}: MobileFilterDrawerProps) => {
    const [open, setOpen] = useState(false);

    // Count active filters
    const activeFilterCount = [
        searchQuery,
        location,
        jobType !== 'all' ? jobType : null,
        salaryMin,
        salaryMax,
        experienceMin,
        experienceMax,
        specialtyIds.length > 0 ? specialtyIds : null,
        postedWithin !== 'all' ? postedWithin : null,
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

                    {/* Specialty Selector */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Specialties</label>
                        <SpecialtySelector
                            selectedIds={specialtyIds}
                            onChange={onSpecialtyIdsChange}
                        />
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

                    {/* Salary Range */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Salary Range</label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                placeholder="Min Salary"
                                value={salaryMin}
                                onChange={(e) => onSalaryMinChange(e.target.value ? Number(e.target.value) : '')}
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                type="number"
                                placeholder="Max Salary"
                                value={salaryMax}
                                onChange={(e) => onSalaryMaxChange(e.target.value ? Number(e.target.value) : '')}
                            />
                        </div>
                    </div>

                    {/* Experience Range */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Experience (Years)</label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                placeholder="Min Exp"
                                value={experienceMin}
                                onChange={(e) => onExperienceMinChange(e.target.value ? Number(e.target.value) : '')}
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                type="number"
                                placeholder="Max Exp"
                                value={experienceMax}
                                onChange={(e) => onExperienceMaxChange(e.target.value ? Number(e.target.value) : '')}
                            />
                        </div>
                    </div>

                    {/* Posted Within */}
                    <div className="space-y-2">
                        <label htmlFor="mobile-posted-within" className="text-sm font-medium">
                            Posted Within
                        </label>
                        <Select value={postedWithin} onValueChange={onPostedWithinChange}>
                            <SelectTrigger id="mobile-posted-within">
                                <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any Time</SelectItem>
                                <SelectItem value="24h">Last 24 Hours</SelectItem>
                                <SelectItem value="7d">Last 7 Days</SelectItem>
                                <SelectItem value="30d">Last 30 Days</SelectItem>
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
