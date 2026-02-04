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
import { ArrowRight, ArrowLeft, BookmarkPlus } from 'lucide-react';
import { SavedJobCard } from './SavedJobCard';
import { EmptyState } from './EmptyState';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface SavedJob {
    id: string;
    jobId: string;
    savedAt: string;
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

interface SavedJobsListProps {
    savedJobs: SavedJob[];
    isLoading: boolean;
}

export function SavedJobsList({ savedJobs, isLoading }: SavedJobsListProps) {
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
                        <CardTitle className="text-xl md:text-2xl font-bold text-foreground">Saved Jobs</CardTitle>
                        <CardDescription className="text-sm md:text-base text-muted-foreground mt-1">
                            Jobs you've bookmarked for later
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center justify-between max-md:w-full">
                        <Button asChild size="sm">
                            <Link href={FRONTEND_ROUTES.SAVED_JOBS} className="flex items-center gap-2">
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
                                aria-label="Previous saved job"
                            >
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button
                                type="button"
                                size="icon"
                                onClick={() => carouselApi?.scrollNext()}
                                disabled={!canScrollNext}
                                aria-label="Next saved job"
                            >
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {savedJobs.length === 0 ? (
                    <EmptyState
                        icon={BookmarkPlus}
                        title="No saved jobs"
                        description="Save interesting jobs to review them later and apply when you're ready"
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
                                        {savedJobs.map((savedJob, index) => (
                                            <CarouselItem key={savedJob.id || index} className="basis-full">
                                                <SavedJobCard savedJob={savedJob} />
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
                                    {savedJobs.map((savedJob, index) => (
                                        <SavedJobCard key={savedJob.id || index} savedJob={savedJob} />
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
