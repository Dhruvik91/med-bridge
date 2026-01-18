import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, Eye } from 'lucide-react';
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

interface SavedJobCardProps {
    savedJob: SavedJob;
}

export function SavedJobCard({ savedJob }: SavedJobCardProps) {
    return (
        <Link
            href={`${FRONTEND_ROUTES.JOBS.BASE}/${savedJob.jobId}`}
            className="group block p-4 md:p-5 border rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 bg-gradient-to-r from-background to-muted/20 hover:from-primary/5 hover:to-primary/10"
        >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                            <BookmarkPlus className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                                {savedJob.job?.title || 'Job Title'}
                            </h4>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-md px-2 py-1 w-fit">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Saved {new Date(savedJob.savedAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="self-start md:self-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Eye className="h-4 w-4 mr-2" />
                    View Job
                </Button>
            </div>
        </Link>
    );
}
