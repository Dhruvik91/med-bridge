import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, X } from 'lucide-react';
import { JobType } from '@/types';
import { SpecialtySelector } from './SpecialtySelector';

interface JobSearchFiltersProps {
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

export const JobSearchFilters = ({
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
                <SelectTrigger className="w-[140px] h-10" aria-label="Job type filter">
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

            {/* Specialty Selector */}
            <SpecialtySelector
                selectedIds={specialtyIds}
                onChange={onSpecialtyIdsChange}
            />

            {/* Salary Range */}
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    placeholder="Min Salary"
                    className="w-[110px] h-10"
                    value={salaryMin}
                    onChange={(e) => onSalaryMinChange(e.target.value ? Number(e.target.value) : '')}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                    type="number"
                    placeholder="Max Salary"
                    className="w-[110px] h-10"
                    value={salaryMax}
                    onChange={(e) => onSalaryMaxChange(e.target.value ? Number(e.target.value) : '')}
                />
            </div>

            {/* Experience Range */}
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    placeholder="Min Exp"
                    className="w-[100px] h-10"
                    value={experienceMin}
                    onChange={(e) => onExperienceMinChange(e.target.value ? Number(e.target.value) : '')}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                    type="number"
                    placeholder="Max Exp"
                    className="w-[100px] h-10"
                    value={experienceMax}
                    onChange={(e) => onExperienceMaxChange(e.target.value ? Number(e.target.value) : '')}
                />
            </div>

            {/* Posted Within */}
            <Select value={postedWithin} onValueChange={onPostedWithinChange}>
                <SelectTrigger className="w-[140px] h-10">
                    <SelectValue placeholder="Posted Within" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Any Time</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
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
