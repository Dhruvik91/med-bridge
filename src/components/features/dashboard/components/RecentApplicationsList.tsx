import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight } from 'lucide-react';
import { Application, Job } from '@/types';
import { RecentApplicationCard } from './RecentApplicationCard';

interface RecentApplicationsListProps {
    applications: Application[];
    jobs: Job[];
}

export function RecentApplicationsList({ applications, jobs }: RecentApplicationsListProps) {
    const recentApplications = applications.slice(0, 5);

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
                    <Button asChild size="sm" className="self-start sm:self-center">
                        <Link href="/applications/manage" className="flex items-center gap-2">
                            <span className="font-medium">View All</span>
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Button>
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
                )}
            </CardContent>
        </Card>
    );
}
