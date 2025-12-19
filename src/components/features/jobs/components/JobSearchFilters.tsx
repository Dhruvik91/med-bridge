import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, X } from 'lucide-react';
import { JobType } from '@/types';

interface JobSearchFiltersProps {
    searchQuery: string;
    location: string;
    jobType: JobType | 'all';
    onSearchChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onJobTypeChange: (value: JobType | 'all') => void;
    onClearFilters: () => void;
    showClearButton: boolean;
}

export const JobSearchFilters = ({
    searchQuery,
    location,
    jobType,
    onSearchChange,
    onLocationChange,
    onJobTypeChange,
    onClearFilters,
    showClearButton,
}: JobSearchFiltersProps) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit} className="hidden md:flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
                <Input
                    type="text"
                    placeholder="Job title, specialty, or keyword"
                    className="pl-10 h-10"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    aria-label="Search jobs"
                />
            </div>

            {/* Location Input */}
            <div className="relative flex-1 min-w-[200px]">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
                <Input
                    type="text"
                    placeholder="City, state, or country"
                    className="pl-10 h-10"
                    value={location}
                    onChange={(e) => onLocationChange(e.target.value)}
                    aria-label="Location"
                />
            </div>

            {/* Job Type Select */}
            <Select value={jobType} onValueChange={(value) => onJobTypeChange(value as JobType | 'all')}>
                <SelectTrigger className="w-[160px] h-10" aria-label="Job type filter">
                    <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value={JobType.full_time}>Full Time</SelectItem>
                    <SelectItem value={JobType.part_time}>Part Time</SelectItem>
                    <SelectItem value={JobType.contract}>Contract</SelectItem>
                    <SelectItem value={JobType.temporary}>Temporary</SelectItem>
                </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {showClearButton && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-10"
                >
                    <X className="mr-2 h-4 w-4" aria-hidden="true" />
                    Clear
                </Button>
            )}
        </form>
    );
};
