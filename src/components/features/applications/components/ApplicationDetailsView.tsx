import React from 'react';
import { Application } from '@/types';
import { ApplicationHeader } from './ApplicationHeader';
import { ApplicationInfo } from './ApplicationInfo';

interface ApplicationDetailsViewProps {
    application: Application;
}

export function ApplicationDetailsView({ application }: ApplicationDetailsViewProps) {
    return (
        <div className="min-h-screen bg-muted/20">
            {/* Header Section */}
            <div className="bg-background border-b sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <ApplicationHeader application={application} />
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <ApplicationInfo application={application} />
            </div>
        </div>
    );
}
