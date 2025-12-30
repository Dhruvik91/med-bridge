import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel';
import { Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { Application, Job } from '@/types';
import { RecentApplicationCard } from './RecentApplicationCard';

interface RecentApplicationsListProps {
    applications: Application[];
    jobs: Job[];
}

export function RecentApplicationsList({ applications, jobs }: RecentApplicationsListProps) {
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const recentApplications = applications.slice(0, 5);

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
        <Card>
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
                            Recent Applications
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base text-muted-foreground mt-1">
                            Latest candidates who applied to your jobs
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center justify-between max-md:w-full">
                        <Button asChild size="sm">
                            <Link href="/applications/manage" className="flex items-center gap-2">
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
                    <div className="text-center py-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border-2 border-dashed border-muted">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">No applications yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Applications will appear here once candidates start applying to your job postings
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="md:hidden">
                            <Carousel opts={{ align: 'start' }} className="w-full" setApi={setCarouselApi}>
                                <CarouselContent>
                                    {recentApplications.map((application) => {
                                        const job = jobs.find(j => j.id === application.jobId);
                                        return (
                                            <CarouselItem key={application.id} className="basis-full">
                                                <RecentApplicationCard
                                                    application={application}
                                                    jobTitle={job?.title || 'Job'}
                                                />
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>
                            </Carousel>
                        </div>

                        <div className="hidden md:block max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                            <div className="space-y-4">
                                {recentApplications.map((application) => {
                                    const job = jobs.find(j => j.id === application.jobId);
                                    return (
                                        <RecentApplicationCard
                                            key={application.id}
                                            application={application}
                                            jobTitle={job?.title || 'Job'}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
