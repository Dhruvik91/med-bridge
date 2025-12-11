import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const JobsManageSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="space-y-2">
                        <Skeleton className="h-8 md:h-10 w-64 md:w-80" />
                        <Skeleton className="h-5 w-48 md:w-64" />
                    </div>
                    <Skeleton className="h-10 w-full md:w-40" />
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardHeader className="pb-3">
                                <Skeleton className="h-4 w-20" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-12 mb-1" />
                                <Skeleton className="h-3 w-16" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Search and Filters Skeleton */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-full md:w-40" />
            </div>

            {/* Job Cards Skeleton */}
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                        <Skeleton className="h-6 w-48 md:w-64" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Skeleton className="h-5 w-24" />
                                        <Skeleton className="h-5 w-32" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0 pb-4">
                            <div className="mb-4 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>

                            <div className="flex flex-wrap gap-2 mb-5">
                                {[1, 2, 3].map((j) => (
                                    <Skeleton key={j} className="h-6 w-20" />
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                            <Skeleton className="h-10 w-full sm:w-40" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};
