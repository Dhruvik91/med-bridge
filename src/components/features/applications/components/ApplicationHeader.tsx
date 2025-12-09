import React from 'react';
import { Application } from '@/types';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { Building2, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ApplicationHeaderProps {
    application: Application;
}

export function ApplicationHeader({ application }: ApplicationHeaderProps) {
    const { job, status, appliedAt } = application;

    if (!job) return null;

    return (
        <div className="bg-white rounded-lg border p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {job.organization?.name && (
                            <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                <span>{job.organization.name}</span>
                            </div>
                        )}
                        {job.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location.city}, {job.location.country}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Applied on {format(new Date(appliedAt), 'MMM d, yyyy')}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ApplicationStatusBadge status={status} />
                </div>
            </div>
        </div>
    );
}
