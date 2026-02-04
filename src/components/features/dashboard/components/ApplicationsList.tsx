import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel';
import { ArrowRight, ArrowLeft, Briefcase } from 'lucide-react';
import { ApplicationStatus } from '@/types';
import { ApplicationCard } from './ApplicationCard';
import { EmptyState } from './EmptyState';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface Application {
    id: string;
    jobId: string;
    status: ApplicationStatus;
    appliedAt: string;
    job?: {
        title?: string;
        organization?: {
            name?: string;
        };
        employerProfile?: {
            name?: string;
        };
    };
}

interface ApplicationsListProps {
    applications: Application[];
    isLoading: boolean;
    getStatusIcon: (status: ApplicationStatus) => React.ReactNode;
    getStatusColor: (status: ApplicationStatus) => string;
}

export function ApplicationsList({ applications, isLoading, getStatusIcon, getStatusColor }: ApplicationsListProps) {
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    useEffect(() => {
        if (!carouselApi) {
            setCanScrollPrev(false);
            setCanScrollNext(false);
            return;
        }

        const update = () => {
            setCanScrollPrev(carouselApi.canScrollPrev());
            setCanScrollNext(carouselApi.canScrollNext());
        };

        update();
        carouselApi.on('select', update);
        carouselApi.on('reInit', update);

        return () => {
            carouselApi.off('select', update);
            carouselApi.off('reInit', update);
        };
    }, [carouselApi]);

    return (
        <Card className="glass-enhanced transition-all duration-300">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <CardTitle className="text-xl md:text-2xl font-bold text-foreground">Recent Applications</CardTitle>
                        <CardDescription className="text-sm md:text-base text-muted-foreground mt-1">
                            Track the status of your job applications
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center justify-between max-md:w-full">
                        <Button asChild size="sm">
                            <Link href={FRONTEND_ROUTES.APPLICATIONS.BASE} className="flex items-center gap-2">
                                <span className="font-medium">View All</span>
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-1 md:hidden">
                            <Button
                                type="button"
                                size="icon"
                                onClick={() => carouselApi?.scrollPrev()}
                                disabled={!canScrollPrev}
                                aria-label="Previous application"
                            >
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button
                                type="button"
                                size="icon"
                                onClick={() => carouselApi?.scrollNext()}
                                disabled={!canScrollNext}
                                aria-label="Next application"
                            >
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {applications.length === 0 ? (
                    <EmptyState
                        icon={Briefcase}
                        title="No applications yet"
                        description="Start applying to jobs to see them here and track your application progress"
                        actionLabel="Browse Jobs"
                        actionHref={FRONTEND_ROUTES.JOBS.BASE}
                    />
                ) : (
                    <>
                        <div className="md:hidden">
                            {isLoading ? (
                                <Carousel opts={{ align: 'start' }} className="w-full" setApi={setCarouselApi}>
                                    <CarouselContent>
                                        {[1, 2, 3].map(i => (
                                            <CarouselItem key={i} className="basis-full">
                                                <Skeleton className="h-24" />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                </Carousel>
                            ) : (
                                <Carousel opts={{ align: 'start' }} className="w-full" setApi={setCarouselApi}>
                                    <CarouselContent>
                                        {applications.map((application) => (
                                            <CarouselItem key={application.id} className="basis-full">
                                                <ApplicationCard
                                                    application={application}
                                                    getStatusIcon={getStatusIcon}
                                                    getStatusColor={getStatusColor}
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                </Carousel>
                            )}
                        </div>

                        <div className="hidden md:block max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <Skeleton key={i} className="h-24" />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {applications.map((application) => (
                                        <ApplicationCard
                                            key={application.id}
                                            application={application}
                                            getStatusIcon={getStatusIcon}
                                            getStatusColor={getStatusColor}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
