import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, BookmarkPlus } from 'lucide-react';
import { SavedJobCard } from './SavedJobCard';
import { EmptyState } from './EmptyState';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface SavedJob {
    id: string;
    jobId: string;
    savedAt: string;
    job?: {
        title?: string;
        organization?: {
            name?: string;
        };
        employerProfile?: {
            name?: string;
        };
    };
}

interface SavedJobsListProps {
    savedJobs: SavedJob[];
    isLoading: boolean;
}

export function SavedJobsList({ savedJobs, isLoading }: SavedJobsListProps) {
    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <CardTitle className="text-xl md:text-2xl font-bold text-foreground">Saved Jobs</CardTitle>
                        <CardDescription className="text-sm md:text-base text-muted-foreground mt-1">
                            Jobs you've bookmarked for later
                        </CardDescription>
                    </div>
                    <Button asChild size="sm" className="self-start sm:self-center">
                        <Link href={FRONTEND_ROUTES.SAVED_JOBS} className="flex items-center gap-2">
                            <span className="font-medium">View All</span>
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-24" />
                        ))}
                    </div>
                ) : savedJobs.length === 0 ? (
                    <EmptyState
                        icon={BookmarkPlus}
                        title="No saved jobs"
                        description="Save interesting jobs to review them later and apply when you're ready"
                        actionLabel="Browse Jobs"
                        actionHref={FRONTEND_ROUTES.JOBS.BASE}
                    />
                ) : (
                    <div className="space-y-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {savedJobs.map((savedJob) => (
                            <SavedJobCard key={savedJob.id} savedJob={savedJob} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
