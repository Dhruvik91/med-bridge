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
    File
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApplicationStatus, Application, Job, DoctorProfile } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface ApplicationCardProps {
    application: Application;
    job: Job | undefined;
    candidate: DoctorProfile | undefined | null;
    onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export function ApplicationCard({ application, job, candidate, onStatusChange }: ApplicationCardProps) {

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
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
                {/* Header with Name and Status Badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-xl mb-1 truncate">
                                {candidate?.displayName || candidate?.fullName || 'Candidate'}
                            </CardTitle>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{job?.title || 'Job Title'}</span>
                            </div>
                        </div>
                    </div>
                    <Badge className={`${getStatusColor(application.status)} flex-shrink-0`}>
                        <span className="flex items-center gap-1.5">
                            {getStatusIcon(application.status)}
                            {getStatusLabel(application.status)}
                        </span>
                    </Badge>
                </div>

                {/* Application Date */}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Applied {formatDate(application.appliedAt)}</span>
                </div>

                {/* Candidate Details Grid */}
                {candidate && (
                    <div className="space-y-2 mb-4">
                        {candidate.experienceYears !== null && candidate.experienceYears !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                                <Award className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span>{candidate.experienceYears} years experience</span>
                            </div>
                        )}
                        {candidate.city && candidate.country && (
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span>{candidate.city}, {candidate.country}</span>
                            </div>
                        )}
                        {candidate.phone && (
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span>{candidate.phone}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Specialties */}
                {candidate?.specialties && candidate.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {candidate.specialties.slice(0, 3).map((specialty: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                                {specialty}
                            </Badge>
                        ))}
                        {candidate.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{candidate.specialties.length - 3} more
                            </Badge>
                        )}
                    </div>
                )}

                {/* Cover Letter */}
                {application.coverLetter && (
                    <div className="bg-muted/50 p-3 rounded-md border border-border/50">
                        <p className="text-sm font-medium mb-1.5">Cover Letter</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {application.coverLetter}
                        </p>
                    </div>
                )}
            </CardHeader>

            <CardFooter className="flex flex-col gap-4 pt-4 border-t bg-muted/20">
                {/* Status Update Section */}
                <div className="w-full">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                        Application Status
                    </label>
                    <Select
                        value={application.status}
                        onValueChange={(value) => onStatusChange(application.id, value as ApplicationStatus)}
                    >
                        <SelectTrigger className="w-full h-10 bg-background">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ApplicationStatus.applied}>New Application</SelectItem>
                            <SelectItem value={ApplicationStatus.viewed}>Viewed</SelectItem>
                            <SelectItem value={ApplicationStatus.shortlisted}>Shortlisted</SelectItem>
                            <SelectItem value={ApplicationStatus.interview}>Interview</SelectItem>
                            <SelectItem value={ApplicationStatus.offer}>Offer</SelectItem>
                            <SelectItem value={ApplicationStatus.hired}>Hired</SelectItem>
                            <SelectItem value={ApplicationStatus.rejected}>Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 w-full flex-wrap">
                    {(application.resumeUrl || candidate?.resumeUrl) && (
                        <Button
                            asChild
                            variant="outline"
                            className="flex-1 h-10 justify-start gap-2 bg-background hover:bg-accent"
                        >
                            <a
                                href={application.resumeUrl || candidate?.resumeUrl || ''}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FileText className="h-4 w-4" />
                                <span>View Resume</span>
                                <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-60" />
                            </a>
                        </Button>
                    )}
                    <Button
                        asChild
                        variant="secondary"
                        className="flex-1 h-10 justify-start gap-2"
                    >
                        <Link href={`${FRONTEND_ROUTES.APPLICATIONS.BASE}/${application.id}`}>
                            <File className="h-4 w-4" />
                            <span>Application Details</span>
                            <ArrowRight className="h-4 w-4 ml-auto" />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="default"
                        className="flex-1 h-10 justify-start gap-2"
                    >
                        <Link href={`${FRONTEND_ROUTES.JOBS.BASE}/${application.jobId}`}>
                            <Briefcase className="h-4 w-4" />
                            <span>View Job Posting</span>
                            <ArrowRight className="h-4 w-4 ml-auto" />
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
