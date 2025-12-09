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
    ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApplicationStatus, Application, Job, DoctorProfile } from '@/types';

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
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-xl mb-1">
                                    {candidate?.displayName || candidate?.fullName || 'Candidate'}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Briefcase className="h-4 w-4" />
                                        {job?.title || 'Job Title'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Applied {formatDate(application.appliedAt)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Candidate Details */}
                        {candidate && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                {candidate.experienceYears !== null && candidate.experienceYears !== undefined && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Award className="h-4 w-4 text-muted-foreground" />
                                        <span>{candidate.experienceYears} years experience</span>
                                    </div>
                                )}
                                {candidate.city && candidate.country && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{candidate.city}, {candidate.country}</span>
                                    </div>
                                )}
                                {candidate.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{candidate.phone}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Specialties */}
                        {candidate?.specialties && candidate.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
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
                            <div className="bg-muted/50 p-3 rounded-md">
                                <p className="text-sm font-medium mb-1">Cover Letter</p>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {application.coverLetter}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                        <Badge className={getStatusColor(application.status)}>
                            <span className="flex items-center gap-1">
                                {getStatusIcon(application.status)}
                                {getStatusLabel(application.status)}
                            </span>
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardFooter className="flex flex-wrap gap-2">
                <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Update Status</label>
                    <Select
                        value={application.status}
                        onValueChange={(value) => onStatusChange(application.id, value as ApplicationStatus)}
                    >
                        <SelectTrigger className="w-full md:w-[200px]">
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
                <div className="flex gap-2 items-end">
                    {(application.resumeUrl || candidate?.resumeUrl) && (
                        <Button asChild variant="outline" size="sm">
                            <a href={application.resumeUrl || candidate?.resumeUrl || ''} target="_blank" rel="noopener noreferrer">
                                View Resume
                            </a>
                        </Button>
                    )}
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/jobs/${application.jobId}`}>
                            View Job
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
