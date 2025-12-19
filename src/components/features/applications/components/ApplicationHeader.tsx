import React from 'react';
import { Application } from '@/types';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { Building2, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface ApplicationHeaderProps {
    application: Application;
}

export function ApplicationHeader({ application }: ApplicationHeaderProps) {
    const { job, status, appliedAt } = application;

    if (!job) return null;

    return (
        <div className="space-y-6">
            <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
                <Link href={FRONTEND_ROUTES.APPLICATIONS.MANAGE} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Applications
                </Link>
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-extrabold tracking-tight">{job.title}</h1>
                        <ApplicationStatusBadge status={status} />
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
                        {job.organization?.name && (
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary" />
                                <span>{job.organization.name}</span>
                            </div>
                        )}
                        {job.location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{job.location.city}, {job.location.country}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>Applied {format(new Date(appliedAt), 'MMM d, yyyy')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
