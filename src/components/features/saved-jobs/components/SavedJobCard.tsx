import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    MapPin,
    DollarSign,
    Clock,
    Building2,
    ArrowRight,
    Trash2
} from 'lucide-react';
import { SavedJob, JobType } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavedJobCardProps {
    savedJob: SavedJob;
    onUnsave: (jobId: string) => void;
    isDeleting: boolean;
    formatSalary: (min?: string | number, max?: string | number) => string;
    getJobTypeLabel: (type: JobType) => string;
    formatDate: (dateString: string) => string;
}

export function SavedJobCard({
    savedJob,
    onUnsave,
    isDeleting,
    formatSalary,
    getJobTypeLabel,
    formatDate,
}: SavedJobCardProps) {
    const [showUnsaveConfirmation, setShowUnsaveConfirmation] = useState(false);
    const job = savedJob.job;

    if (!job) return null;

    const handleUnsaveConfirm = () => {
        onUnsave(job.id);
        setShowUnsaveConfirmation(false);
    };

    return (
        <>
            <Card className="flex flex-col transition-all duration-300 hover:shadow-2xl glass-enhanced hover:border-primary/50">
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <Link href={`${FRONTEND_ROUTES.JOBS.BASE}/${job.id}`} className="hover:underline">
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
                        <Link href={`${FRONTEND_ROUTES.JOBS.BASE}/${job.id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowUnsaveConfirmation(true)}
                        disabled={isDeleting}
                        title="Remove from saved jobs"
                    >
                        {isDeleting ? (
                            <Skeleton className="h-4 w-4" />
                        ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <AlertDialog open={showUnsaveConfirmation} onOpenChange={setShowUnsaveConfirmation}>
                <AlertDialogContent className="w-[90%]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove saved job?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove this job from your saved list? You can always save it again later if you change your mind.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleUnsaveConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
