import React from 'react';
import Link from 'next/link';
import {
    Clock,
    Eye,
    TrendingUp,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MapPin,
    Building2,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApplicationStatus, Application } from '@/types';
import { useWithdrawApplication } from '@/hooks/post/useWithdrawApplication';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';

interface CandidateApplicationCardProps {
    application: Application;
}

export function CandidateApplicationCard({ application }: CandidateApplicationCardProps) {
    const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawApplication();

    const canWithdraw = [
        ApplicationStatus.applied,
        ApplicationStatus.viewed,
        ApplicationStatus.shortlisted
    ].includes(application.status);

    const handleWithdraw = () => {
        withdraw(application.id);
    };

    const getStatusIcon = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.applied:
                return <Clock className="h-4 w-4" />;
            case ApplicationStatus.viewed:
                return <Eye className="h-4 w-4" />;
            case ApplicationStatus.interview:
            case ApplicationStatus.shortlisted:
                return <TrendingUp className="h-4 w-4" />;
            case ApplicationStatus.hired:
            case ApplicationStatus.offer:
                return <CheckCircle2 className="h-4 w-4" />;
            case ApplicationStatus.rejected:
            case ApplicationStatus.withdrawn:
                return <XCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.hired:
            case ApplicationStatus.offer:
                return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200';
            case ApplicationStatus.interview:
            case ApplicationStatus.shortlisted:
                return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200';
            case ApplicationStatus.rejected:
            case ApplicationStatus.withdrawn:
                return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-200';
            case ApplicationStatus.viewed:
                return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200';
            default:
                return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200';
        }
    };

    const getStatusLabel = (status: ApplicationStatus) => {
        return status.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Card className="transition-all duration-300 hover:shadow-2xl hover:border-primary/50 overflow-hidden flex flex-col h-full glass-enhanced">
            <CardHeader className="pb-3 px-4 pt-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <Link href={`/jobs/${application.jobId}`} className="group">
                            <CardTitle className="text-lg md:text-xl font-bold tracking-tight mb-1 truncate group-hover:text-primary transition-colors">
                                {application.job?.title || 'Job Title'}
                            </CardTitle>
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge className={`${getStatusColor(application.status)} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-none`}>
                                <span className="flex items-center gap-1">
                                    {getStatusIcon(application.status)}
                                    {getStatusLabel(application.status)}
                                </span>
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-muted/60 text-muted-foreground border-none">
                                <Building2 className="h-3 w-3 mr-1" />
                                {application.job?.organization?.name || application.job?.employerProfile?.name || 'Company'}
                            </Badge>
                        </div>
                    </div>
                    {canWithdraw && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 shrink-0" disabled={isWithdrawing}>
                                    {isWithdrawing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-[92vw] sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-bold text-destructive">Withdraw Application?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground">
                                        This action cannot be undone. You will need to re-apply if you change your mind later.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-6 gap-2">
                                    <AlertDialogCancel className="rounded-xl border-muted-foreground/20">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleWithdraw} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                                        Withdraw
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </CardHeader>

            <CardContent className="px-4 py-2 flex-grow space-y-4">
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    {application.job?.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
                            <span className="truncate leading-none">{application.job.location.city}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                        <Calendar className="h-4 w-4 shrink-0 text-primary/70" />
                        <span className="truncate leading-none font-medium">Applied {formatDate(application.appliedAt)}</span>
                    </div>
                </div>

                {application.coverLetter && (
                    <div className="bg-muted/30 p-3 rounded-xl border border-border/50 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary/40 transition-colors" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-1.5 flex items-center justify-between">
                            Cover Letter Snippet
                        </p>
                        <p className="text-sm text-foreground/80 line-clamp-2 italic leading-relaxed pl-1">
                            "{application.coverLetter}"
                        </p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="px-4 pb-4 pt-3 border-t border-border/40 bg-muted/10">
                <Button asChild size="sm" variant="default" className="w-full rounded-xl gap-2 shadow-sm">
                    <Link href={`/jobs/${application.jobId}`}>
                        <span>View Job Details</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
