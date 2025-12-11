import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ProfileSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid gap-6 md:grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-32" />
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                {[1, 2].map(i => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
