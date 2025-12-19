import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { ApplicationStatus } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface Application {
    id: string;
    jobId: string;
    status: ApplicationStatus;
    appliedAt: string;
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

interface ApplicationCardProps {
    application: Application;
    getStatusIcon: (status: ApplicationStatus) => React.ReactNode;
    getStatusColor: (status: ApplicationStatus) => string;
}

export function ApplicationCard({ application, getStatusIcon, getStatusColor }: ApplicationCardProps) {
    return (
        <Link
            href={`${FRONTEND_ROUTES.JOBS.BASE}/${application.jobId}`}
            className="group block p-4 md:p-5 border rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 bg-gradient-to-r from-background to-muted/20 hover:from-primary/5 hover:to-primary/10"
        >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-row sm:items-start gap-2 sm:gap-3 mb-3">
                        <h4 className="font-semibold text-base md:text-lg text-foreground group-hover:text-primary transition-colors">
                            {application.job?.title || 'Job Title'}
                        </h4>
                        <Badge className={`${getStatusColor(application.status)} capitalize font-medium`}>
                            <span className="flex items-center gap-1">
                                {getStatusIcon(application.status)}
                                {application.status.replace('_', ' ')}
                            </span>
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-md px-2 py-1 w-fit">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
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
