import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '@/types';

interface ApplicationStatusBadgeProps {
    status: ApplicationStatus;
}

const statusStyles: Record<ApplicationStatus, string> = {
    [ApplicationStatus.applied]: 'bg-primary/10 text-foreground hover:bg-primary/15',
    [ApplicationStatus.viewed]: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    [ApplicationStatus.shortlisted]: 'bg-accent text-accent-foreground hover:bg-accent/80',
    [ApplicationStatus.interview]: 'bg-muted text-muted-foreground hover:bg-muted/80',
    [ApplicationStatus.offer]: 'bg-primary/15 text-foreground hover:bg-primary/20',
    [ApplicationStatus.hired]: 'bg-primary text-primary-foreground hover:bg-primary/90',
    [ApplicationStatus.rejected]: 'bg-destructive/10 text-destructive hover:bg-destructive/15',
    [ApplicationStatus.withdrawn]: 'bg-muted text-muted-foreground hover:bg-muted/80',
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
