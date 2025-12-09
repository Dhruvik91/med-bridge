import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApplicationStatus, Job } from '@/types';

interface DesktopApplicationFilterDrawerProps {
    jobFilter: string;
    setJobFilter: (jobId: string) => void;
    statusFilter: ApplicationStatus | 'all';
    setStatusFilter: (status: ApplicationStatus | 'all') => void;
    sortBy: 'recent' | 'oldest';
    setSortBy: (sort: 'recent' | 'oldest') => void;
    jobs: Job[];
}

export function DesktopApplicationFilterDrawer({
    jobFilter,
    setJobFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    jobs
}: DesktopApplicationFilterDrawerProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-full max-w-[700px] mx-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>Filter Applications</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-1 gap-6 pb-6">
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
            </SheetContent>
        </Sheet>
    );
}
