import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton() {
    return (
        <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
            <Skeleton className="h-8 md:h-12 w-48 md:w-64" />
            <div className="grid gap-3 grid-cols-2 md:gap-6 lg:grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-24 md:h-32" />
                ))}
            </div>
        </div>
    );
}
