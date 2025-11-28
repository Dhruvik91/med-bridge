'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookmarkPlus,
  MapPin, 
  DollarSign, 
  Clock,
  Building2,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { useJobFormatters } from '@/hooks/useJobFormatters';

export default function SavedJobsPage() {
  const {
    user,
    userLoading,
    savedJobs,
    savedJobsLoading,
    deletingJobId,
    handleUnsaveJob,
  } = useSavedJobs();

  const { formatSalary, getJobTypeLabel, formatDate } = useJobFormatters();

  if (userLoading || savedJobsLoading) {
    return (
      <>
        <main className="pt-16 min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <main className="pt-16 min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Alert>
              <AlertDescription>
                Please sign in to view your saved jobs.
              </AlertDescription>
            </Alert>
            <Button asChild className="mt-4">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <main className="pt-16 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Saved Jobs</h1>
            <p className="text-muted-foreground">
              {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved for later
            </p>
          </div>

          {/* Empty State */}
          {savedJobs.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <BookmarkPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No saved jobs yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start saving jobs you're interested in to review them later. You can find jobs on the browse page.
                </p>
                <Button asChild size="lg">
                  <Link href="/jobs">
                    Browse Jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Saved Jobs Grid */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedJobs.map((savedJob) => {
                const job = savedJob.job;
                if (!job) return null;

                return (
                  <Card key={savedJob.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link href={`/jobs/${job.id}`} className="hover:underline">
                        <CardTitle className="text-xl mb-2 line-clamp-2">{job.title}</CardTitle>
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" aria-hidden="true" />
                          <span className="truncate">
                            {job.organization?.name || job.employerProfile?.name || 'Healthcare Facility'}
                          </span>
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{getJobTypeLabel(job.jobType)}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  <CardDescription className="line-clamp-3 mb-4">
                    {job.description}
                  </CardDescription>

                  <div className="space-y-2 text-sm">
                    {job.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">
                          {job.location.city}, {job.location.country}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Saved {formatDate(savedJob.savedAt)}</span>
                    </div>
                  </div>

                  {job.specialties && job.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty.id} variant="outline" className="text-xs">
                          {specialty.name}
                        </Badge>
                      ))}
                      {job.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/jobs/${job.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUnsaveJob(job.id)}
                    disabled={deletingJobId === job.id}
                    title="Remove from saved jobs"
                  >
                    {deletingJobId === job.id ? (
                      <Skeleton className="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
            })}
            </div>
          )}

          {/* Back to Dashboard Link */}
          {savedJobs.length > 0 && (
            <div className="mt-8 text-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/candidate">Back to Dashboard</Link>
              </Button>
            </div>
          )}
      </div>
    </main>
  );
}
