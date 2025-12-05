import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Briefcase } from 'lucide-react';
import { ApplicationStatus } from '@/types';
import { ApplicationCard } from './ApplicationCard';
import { EmptyState } from './EmptyState';

interface Application {
    id: string;
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

interface ApplicationsListProps {
    applications: Application[];
    isLoading: boolean;
    getStatusIcon: (status: ApplicationStatus) => React.ReactNode;
    getStatusColor: (status: ApplicationStatus) => string;
}

export function ApplicationsList({ applications, isLoading, getStatusIcon, getStatusColor }: ApplicationsListProps) {
    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <CardTitle className="text-xl md:text-2xl font-bold text-foreground">Recent Applications</CardTitle>
                        <CardDescription className="text-sm md:text-base text-muted-foreground mt-1">
                            Track the status of your job applications
                        </CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm" className="self-start sm:self-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
                        <Link href="/applications" className="flex items-center gap-2">
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
                ) : applications.length === 0 ? (
                    <EmptyState
                        icon={Briefcase}
                        title="No applications yet"
                        description="Start applying to jobs to see them here and track your application progress"
                        actionLabel="Browse Jobs"
                        actionHref="/jobs"
                    />
                ) : (
                    <div className="space-y-4">
                        {applications.slice(0, 5).map((application) => (
                            <ApplicationCard
                                key={application.id}
                                application={application}
                                getStatusIcon={getStatusIcon}
                                getStatusColor={getStatusColor}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
