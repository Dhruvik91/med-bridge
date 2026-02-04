import React from 'react';
import Link from 'next/link';
import {
    User,
    Briefcase,
    Calendar,
    Award,
    MapPin,
    Phone,
    Clock,
    Eye,
    TrendingUp,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowRight,
    FileText,
    ExternalLink,
    File,
    MoreVertical,
    Archive,
    Trash2,
    Users,
    Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ApplicationStatus, Application, Job, DoctorProfile } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { useArchiveApplication } from '@/hooks/post/useArchiveApplication';
import { useDeleteApplication } from '@/hooks/delete/useDeleteApplication';
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

interface ApplicationCardProps {
    application: Application;
    job: Job | undefined;
    candidate: DoctorProfile | undefined | null;
    onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export function ApplicationCard({ application, job, candidate, onStatusChange }: ApplicationCardProps) {
    const { mutate: archive, isPending: isArchiving } = useArchiveApplication();
    const { mutate: remove, isPending: isDeleting } = useDeleteApplication();

    const handleArchive = () => {
        archive(application.id);
    };

    const handleDelete = () => {
        remove(application.id);
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
        <Card className="hover-lift smooth-transition hover:border-primary/50 flex flex-col h-full glass-enhanced">
            <CardHeader className="pb-3 px-4 pt-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg md:text-xl font-bold tracking-tight mb-1 truncate">
                            {candidate?.displayName || candidate?.fullName || 'Candidate'}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className={`${getStatusColor(application.status)} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border-none`}>
                                <span className="flex items-center gap-1">
                                    {getStatusIcon(application.status)}
                                    {getStatusLabel(application.status)}
                                </span>
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-muted/60 text-muted-foreground border-none">
                                {job?.title || 'Job Title'}
                            </Badge>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted shrink-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-xl border-border/50">
                            {(application.resumeUrl || candidate?.resumeUrl) && (
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                    <a
                                        href={application.resumeUrl || candidate?.resumeUrl || ''}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span>View Resume</span>
                                        <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                                    </a>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                <Link href={`${FRONTEND_ROUTES.APPLICATIONS.BASE}/${application.id}`}>
                                    <File className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>Application Details</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                <Link href={`${FRONTEND_ROUTES.JOBS.BASE}/${application.jobId}`}>
                                    <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span>View Job Posting</span>
                                </Link>
                            </DropdownMenuItem>

                            <div className="h-px bg-muted mx-1 my-1" />

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        disabled={isArchiving || application.isArchived}
                                        className="rounded-lg cursor-pointer"
                                    >
                                        <Archive className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span>{application.isArchived ? 'Archived' : 'Archive Application'}</span>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-[92vw] sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-xl font-bold">Archive Application?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-muted-foreground">
                                            This will move the application to the archive. You can still view it later.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="mt-6 gap-2">
                                        <AlertDialogCancel className="rounded-xl border-muted-foreground/20">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleArchive} className="rounded-xl">Archive</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer"
                                        disabled={isDeleting}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete Application</span>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-[92vw] sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-xl font-bold text-destructive">Delete Application?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-muted-foreground">
                                            This action is permanent and cannot be undone. All associated data will be lost.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="mt-6 gap-2">
                                        <AlertDialogCancel className="rounded-xl border-muted-foreground/20">Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                                        >
                                            Delete Permanently
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="px-4 py-2 flex-grow space-y-4">
                {/* Candidate Info Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    {candidate?.experienceYears !== null && candidate?.experienceYears !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Award className="h-4 w-4 shrink-0 text-primary/70" />
                            <span className="truncate leading-none">{candidate.experienceYears}y exp</span>
                        </div>
                    )}
                    {candidate?.city && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
                            <span className="truncate leading-none">{candidate.city}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                        <Calendar className="h-4 w-4 shrink-0 text-primary/70" />
                        <span className="truncate leading-none font-medium">Applied {formatDate(application.appliedAt)}</span>
                    </div>
                </div>

                {/* Cover Letter Snippet */}
                {application.coverLetter && (
                    <div className="bg-muted/30 p-3 rounded-xl border border-border/50 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary/40 transition-colors" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 mb-1.5 flex items-center justify-between">
                            Cover Letter
                            <FileText className="h-3 w-3 opacity-30" />
                        </p>
                        <p className="text-sm text-foreground/80 line-clamp-2 italic leading-relaxed pl-1">
                            "{application.coverLetter}"
                        </p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="px-4 pb-4 pt-3 border-t border-border/40 bg-muted/10">
                <div className="w-full space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status Update</p>
                        <Clock className="h-3 w-3 text-muted-foreground opacity-50" />
                    </div>
                    <Select
                        value={application.status}
                        onValueChange={(value) => onStatusChange(application.id, value as ApplicationStatus)}
                    >
                        <SelectTrigger className="w-full h-10 bg-background border-border/60 hover:border-primary/50 transition-all rounded-xl shadow-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50 shadow-xl p-1">
                            <SelectItem value={ApplicationStatus.applied} className="rounded-lg">New Application</SelectItem>
                            <SelectItem value={ApplicationStatus.viewed} className="rounded-lg">Viewed</SelectItem>
                            <SelectItem value={ApplicationStatus.shortlisted} className="rounded-lg">Shortlisted</SelectItem>
                            <SelectItem value={ApplicationStatus.interview} className="rounded-lg">Interview</SelectItem>
                            <SelectItem value={ApplicationStatus.offer} className="rounded-lg">Offer</SelectItem>
                            <SelectItem value={ApplicationStatus.hired} className="rounded-lg">Hired</SelectItem>
                            <SelectItem value={ApplicationStatus.rejected} className="rounded-lg">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardFooter>
        </Card>
    );
}
