import { Metadata } from 'next';
import { ApplicationDetailsContainer } from '@/components/features/applications/container/ApplicationDetails';

export const metadata: Metadata = {
    title: 'Application Details',
    description: 'View details of your job application.',
};

interface ApplicationPageProps {
    params: {
        applicationId: string;
    };
}

export default function ApplicationPage({ params }: ApplicationPageProps) {
    return <ApplicationDetailsContainer applicationId={params.applicationId} />;
}
