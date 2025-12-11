import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const JobFormSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back button skeleton */}
            <Skeleton className="h-10 w-48 mb-6" />

            <div className="max-w-4xl mx-auto">
                {/* Header skeleton */}
                <div className="mb-8">
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>

                {/* Progress indicator skeleton */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <Skeleton className="h-10 w-10 rounded-full mb-2" />
                                    <Skeleton className="h-4 w-24 mb-1" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                {step < 3 && (
                                    <Skeleton className="h-0.5 w-full mx-4 mb-8" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form card skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-48 mb-2" />
                        <Skeleton className="h-4 w-72" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Form field 1 */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Form field 2 */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Form field 3 (textarea) */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Skeleton className="h-10 w-32" />
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
