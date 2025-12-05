import { Skeleton } from '@/components/ui/skeleton';

export function SavedJobsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} className="h-80" />
                ))}
            </div>
        </div>
    );
}
