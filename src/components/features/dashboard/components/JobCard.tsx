import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Eye, TrendingUp, MapPin, EyeIcon } from 'lucide-react';
import { Job, JobStatus } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface JobCardProps {
    job: Job;
    applicationCount: number;
    newApplicationCount: number;
    getJobStatusColor: (status: JobStatus) => string;
}

export function JobCard({ job, applicationCount, newApplicationCount, getJobStatusColor }: JobCardProps) {
    return (
        <Link
            href={`${FRONTEND_ROUTES.JOBS.BASE}/${job.id}`}
            className="group block p-4 md:p-5 transition-all duration-300 glass-enhanced hover:shadow-2xl hover:border-primary/50"
        >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-3">
                        <h4 className="font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors">
                            {job.title}
                        </h4>
                        <Badge variant="secondary" className={`${getJobStatusColor(job.status)} font-medium`}>
                            {job.status}
                        </Badge>
                    </div>
                    {job.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 bg-muted/30 rounded-md px-2 py-1 w-fit">
                            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                            <span className="font-medium">{job.location.city}, {job.location.country}</span>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full">
                            <FileText className="h-4 w-4" aria-hidden="true" />
                            <span className="font-medium">{applicationCount}</span>
                            <span className="text-xs">apps</span>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full">
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            <span className="font-medium">{job.viewCount || job.viewsCount || 0}</span>
                            <span className="text-xs">views</span>
                        </div>
                        {newApplicationCount > 0 && (
                            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 px-3 py-1.5 rounded-full animate-pulse">
                                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                                <span className="font-medium">{newApplicationCount}</span>
                                <span className="text-xs">new</span>
                            </div>
                        )}
                    </div>
                </div>
                <Button variant="outline" size="sm" className="self-start md:self-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Job
                </Button>
            </div>
        </Link>
    );
}
