import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '@/types';

interface ApplicationStatusBadgeProps {
    status: ApplicationStatus;
}

const statusStyles: Record<ApplicationStatus, string> = {
    [ApplicationStatus.applied]: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    [ApplicationStatus.viewed]: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    [ApplicationStatus.shortlisted]: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    [ApplicationStatus.interview]: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    [ApplicationStatus.offer]: 'bg-green-100 text-green-800 hover:bg-green-200',
    [ApplicationStatus.hired]: 'bg-green-600 text-white hover:bg-green-700',
    [ApplicationStatus.rejected]: 'bg-red-100 text-red-800 hover:bg-red-200',
    [ApplicationStatus.withdrawn]: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
};

const statusLabels: Record<ApplicationStatus, string> = {
    [ApplicationStatus.applied]: 'Applied',
    [ApplicationStatus.viewed]: 'Viewed',
    [ApplicationStatus.shortlisted]: 'Shortlisted',
    [ApplicationStatus.interview]: 'Interview',
    [ApplicationStatus.offer]: 'Offer Received',
    [ApplicationStatus.hired]: 'Hired',
    [ApplicationStatus.rejected]: 'Rejected',
    [ApplicationStatus.withdrawn]: 'Withdrawn',
};

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
    return (
        <Badge className={statusStyles[status]} variant="outline">
            {statusLabels[status]}
        </Badge>
    );
}
