import React from 'react';
import Link from 'next/link';
import {
    Clock,
    Eye,
    TrendingUp,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MapPin,
    Building2,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApplicationStatus, Application } from '@/types';

interface CandidateApplicationCardProps {
    application: Application;
}

export function CandidateApplicationCard({ application }: CandidateApplicationCardProps) {
    const getStatusIcon = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.applied:
                return <Clock className="h-4 w-4" />;
            case ApplicationStatus.viewed:
                return <Eye className="h-4 w-4" />;
            case ApplicationStatus.interview:
            case ApplicationStatus.shortlisted:
                return <TrendingUp className="h-4 w-4" />;
            case ApplicationStatus.hired:
            case ApplicationStatus.offer:
                return <CheckCircle2 className="h-4 w-4" />;
            case ApplicationStatus.rejected:
            case ApplicationStatus.withdrawn:
                return <XCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.hired:
            case ApplicationStatus.offer:
                return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200';
            case ApplicationStatus.interview:
            case ApplicationStatus.shortlisted:
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200';
            case ApplicationStatus.rejected:
            case ApplicationStatus.withdrawn:
                return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200';
            case ApplicationStatus.viewed:
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200';
            default:
                return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200';
        }
    };

    const getStatusLabel = (status: ApplicationStatus) => {
        return status.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <Link href={`/jobs/${application.jobId}`} className="hover:underline">
                            <CardTitle className="text-xl mb-2">
                                {application.job?.title || 'Job Title'}
                            </CardTitle>
                        </Link>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {application.job?.organization?.name || application.job?.employerProfile?.name || 'Company'}
                            </span>
                            {application.job?.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {application.job.location.city}, {application.job.location.country}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Applied {formatDate(application.appliedAt)}
                            </span>
                        </div>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                        <span className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            {getStatusLabel(application.status)}
                        </span>
                    </Badge>
                </div>
            </CardHeader>
            {application.coverLetter && (
                <CardContent>
                    <CardDescription className="line-clamp-2">
                        <strong>Cover Letter:</strong> {application.coverLetter}
                    </CardDescription>
                </CardContent>
            )}
            <CardFooter>
                <Button asChild size="sm">
                    <Link href={`/jobs/${application.jobId}`}>
                        View Job Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
