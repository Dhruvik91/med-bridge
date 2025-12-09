import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { JobStatus } from '@/types';

interface ManageJobsFiltersProps {
    searchQuery: string;
    statusFilter: JobStatus | 'all';
    onSearchChange: (value: string) => void;
    onStatusFilterChange: (value: JobStatus | 'all') => void;
    onClearFilters: () => void;
    showClearButton: boolean;
}

export const ManageJobsFilters = ({
    searchQuery,
    statusFilter,
    onSearchChange,
    onStatusFilterChange,
    onClearFilters,
    showClearButton,
}: ManageJobsFiltersProps) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    type="text"
                    placeholder="Search job title, description, or specialty..."
                    className="pl-10 h-10 text-sm"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <Select
                value={statusFilter}
                onValueChange={(value) => onStatusFilterChange(value as JobStatus | 'all')}
            >
                <SelectTrigger className="h-10 w-full sm:w-[180px]">
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
            {showClearButton && (
                <Button type="button" variant="ghost" size="sm" onClick={onClearFilters} className="h-10 px-3">
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};
