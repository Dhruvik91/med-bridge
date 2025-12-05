import { ReactNode } from 'react';

interface SavedJobsGridProps {
    children: ReactNode;
}

export function SavedJobsGrid({ children }: SavedJobsGridProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {children}
        </div>
    );
}
