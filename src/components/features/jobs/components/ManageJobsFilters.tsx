import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <Card className="mb-8 shadow-sm">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search job title, description, or specialty..."
                                className="pl-10 h-11 text-sm"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => onStatusFilterChange(value as JobStatus | 'all')}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Filter by status" />
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

                    {showClearButton && (
                        <div className="flex justify-start">
                            <Button type="button" variant="ghost" size="sm" onClick={onClearFilters} className="text-sm">
                                <X className="mr-2 h-4 w-4" />
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
