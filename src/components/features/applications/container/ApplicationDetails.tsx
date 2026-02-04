'use client';

import React from 'react';
import { useGetApplicationById } from '@/hooks/get/useGetApplicationById';
import { ApplicationDetailsView } from '../components/ApplicationDetailsView';
import { Skeleton } from '@/components/ui/skeleton';
import { BackButton } from '@/components/ui/back-button';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface ApplicationDetailsContainerProps {
    applicationId: string;
}

export function ApplicationDetailsContainer({ applicationId }: ApplicationDetailsContainerProps) {
    const { data: application, isLoading, error } = useGetApplicationById(applicationId);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-6">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-48 w-full" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Application not found</h2>
                <p className="text-muted-foreground mb-6">
                    The application you are looking for does not exist or you do not have permission to view it.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <BackButton fallbackUrl={FRONTEND_ROUTES.APPLICATIONS.BASE} />
            </div>
            <ApplicationDetailsView application={application} />
        </div>
    );
}
