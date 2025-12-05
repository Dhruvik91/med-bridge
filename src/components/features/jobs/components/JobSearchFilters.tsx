import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Filter, X } from 'lucide-react';
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
        <Card className="mb-8">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" aria-hidden="true" />
                            <Input
                                type="text"
                                placeholder="Job title, specialty, or keyword"
                                className="pl-12"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                aria-label="Search jobs"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" aria-hidden="true" />
                            <Input
                                type="text"
                                placeholder="City, state, or country"
                                className="pl-12"
                                value={location}
                                onChange={(e) => onLocationChange(e.target.value)}
                                aria-label="Location"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            <span className="text-sm font-medium">Filters:</span>
                        </div>

                        <Select value={jobType} onValueChange={(value) => onJobTypeChange(value as JobType | 'all')}>
                            <SelectTrigger className="w-[180px]" aria-label="Job type filter">
                                <SelectValue placeholder="Job Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value={JobType.full_time}>Full Time</SelectItem>
                                <SelectItem value={JobType.part_time}>Part Time</SelectItem>
                                <SelectItem value={JobType.contract}>Contract</SelectItem>
                                <SelectItem value={JobType.temporary}>Temporary</SelectItem>
                                <SelectItem value={JobType.remote}>Remote</SelectItem>
                            </SelectContent>
                        </Select>

                        {showClearButton && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={onClearFilters}
                            >
                                <X className="mr-2 h-4 w-4" aria-hidden="true" />
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
