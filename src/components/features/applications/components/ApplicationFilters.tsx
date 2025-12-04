
import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApplicationStatus, Job } from '@/types';

interface ApplicationFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    jobFilter: string;
    setJobFilter: (jobId: string) => void;
    statusFilter: ApplicationStatus | 'all';
    setStatusFilter: (status: ApplicationStatus | 'all') => void;
    sortBy: 'recent' | 'oldest';
    setSortBy: (sort: 'recent' | 'oldest') => void;
    jobs: Job[];
}

export function ApplicationFilters({
    searchQuery,
    setSearchQuery,
    jobFilter,
    setJobFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    jobs
}: ApplicationFiltersProps) {
    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Search Candidates</label>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Filter by Job</label>
                        <Select value={jobFilter} onValueChange={setJobFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Jobs" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Jobs</SelectItem>
                                {jobs.map((job) => (
                                    <SelectItem key={job.id} value={job.id}>
                                        {job.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Filter by Status</label>
                        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Applications" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Applications</SelectItem>
                                <SelectItem value={ApplicationStatus.applied}>New Applications</SelectItem>
                                <SelectItem value={ApplicationStatus.viewed}>Viewed</SelectItem>
                                <SelectItem value={ApplicationStatus.shortlisted}>Shortlisted</SelectItem>
                                <SelectItem value={ApplicationStatus.interview}>Interview</SelectItem>
                                <SelectItem value={ApplicationStatus.offer}>Offer</SelectItem>
                                <SelectItem value={ApplicationStatus.hired}>Hired</SelectItem>
                                <SelectItem value={ApplicationStatus.rejected}>Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
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
                </div>
            </CardContent>
        </Card>
    );
}
