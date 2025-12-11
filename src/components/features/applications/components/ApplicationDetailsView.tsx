import React from 'react';
import { Application } from '@/types';
import { ApplicationHeader } from './ApplicationHeader';
import { ApplicationInfo } from './ApplicationInfo';

interface ApplicationDetailsViewProps {
    application: Application;
}

export function ApplicationDetailsView({ application }: ApplicationDetailsViewProps) {
    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-background border-b">
                <div className="container mx-auto px-4 py-4">
                    <ApplicationHeader application={application} />
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 py-6">
                    <ApplicationInfo application={application} />
                </div>
            </div>
        </div>
    );
}
