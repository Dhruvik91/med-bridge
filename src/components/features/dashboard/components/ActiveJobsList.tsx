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
import { Briefcase, ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { Job, Application, JobStatus, ApplicationStatus } from '@/types';
import { JobCard } from './JobCard';

interface ActiveJobsListProps {
    jobs: Job[];
    applications: Application[];
    isLoading: boolean;
    getJobStatusColor: (status: JobStatus) => string;
}

export function ActiveJobsList({ jobs, applications, isLoading, getJobStatusColor }: ActiveJobsListProps) {
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const publishedJobs = jobs.filter(j => j.status === JobStatus.published).slice(0, 5);

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
                        <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
                            Active Job Postings
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base text-muted-foreground mt-1">
                            Manage your published job listings
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center justify-between max-md:w-full">
                        <Button asChild size="sm">
                            <Link href="/jobs/manage" className="flex items-center gap-2">
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
                                aria-label="Previous job"
                            >
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button
                                type="button"
                                size="icon"
                                onClick={() => carouselApi?.scrollNext()}
                                disabled={!canScrollNext}
                                aria-label="Next job"
                            >
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {jobs.length === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border-2 border-dashed border-muted">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="h-8 w-8 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">No jobs posted yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Create your first job posting to start receiving applications from qualified candidates
                        </p>
                        <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                            <Link href="/jobs/create">
                                <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                                Post Your First Job
                            </Link>
                        </Button>
                    </div>
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
                                        {publishedJobs.map((job) => {
                                            const jobApplications = applications.filter(a => a.jobId === job.id);
                                            const newApplicationCount = jobApplications.filter(a => a.status === ApplicationStatus.applied).length;

                                            return (
                                                <CarouselItem key={job.id} className="basis-full">
                                                    <JobCard
                                                        job={job}
                                                        applicationCount={jobApplications.length}
                                                        newApplicationCount={newApplicationCount}
                                                        getJobStatusColor={getJobStatusColor}
                                                    />
                                                </CarouselItem>
                                            );
                                        })}
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
                                    {publishedJobs.map((job) => {
                                        const jobApplications = applications.filter(a => a.jobId === job.id);
                                        const newApplicationCount = jobApplications.filter(a => a.status === ApplicationStatus.applied).length;

                                        return (
                                            <JobCard
                                                key={job.id}
                                                job={job}
                                                applicationCount={jobApplications.length}
                                                newApplicationCount={newApplicationCount}
                                                getJobStatusColor={getJobStatusColor}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
