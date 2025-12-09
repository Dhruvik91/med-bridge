import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ApplicationStatus, Application } from '@/types';
import { CandidateApplicationCard } from './CandidateApplicationCard';

interface CandidateApplicationListProps {
    isLoading: boolean;
    filteredApplications: Application[];
    statusFilter: ApplicationStatus | 'all';
    setStatusFilter: (status: ApplicationStatus | 'all') => void;
}

export function CandidateApplicationList({
    isLoading,
    filteredApplications,
    statusFilter,
    setStatusFilter
}: CandidateApplicationListProps) {
    const getStatusLabel = (status: ApplicationStatus) => {
        return status.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-40" />
                ))}
            </div>
        );
    }

    if (filteredApplications.length === 0) {
        return (
            <Card className="text-center py-16">
                <CardContent>
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">
                        {statusFilter === 'all' ? 'No applications yet' : `No ${getStatusLabel(statusFilter as ApplicationStatus).toLowerCase()} applications`}
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        {statusFilter === 'all'
                            ? "Start applying to jobs to see them here. Browse available positions and submit your applications."
                            : "Try changing your filter to see other applications."}
                    </p>
                    {statusFilter === 'all' ? (
                        <Button asChild size="lg">
                            <Link href="/jobs">
                                Browse Jobs
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={() => setStatusFilter('all')}>
                            View All Applications
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApplications.map((application) => (
                <CandidateApplicationCard key={application.id} application={application} />
            ))}
        </div>
    );
}
