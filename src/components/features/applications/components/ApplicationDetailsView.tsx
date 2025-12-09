import React from 'react';
import { Application } from '@/types';
import { ApplicationHeader } from './ApplicationHeader';
import { ApplicationInfo } from './ApplicationInfo';

interface ApplicationDetailsViewProps {
    application: Application;
}

export function ApplicationDetailsView({ application }: ApplicationDetailsViewProps) {
    return (
        <div className="space-y-6">
            <ApplicationHeader application={application} />
            <ApplicationInfo application={application} />
        </div>
    );
}
