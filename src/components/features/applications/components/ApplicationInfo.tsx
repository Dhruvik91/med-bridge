import React from 'react';
import { Application } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Building2, Mail, Phone, MapPin, Briefcase, Link as LinkIcon, Calendar, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useGetSpecialties } from '@/hooks/get/useGetSpecialties';
import { useGetQualifications } from '@/hooks/get/useGetQualifications';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface ApplicationInfoProps {
    application: Application;
}

export function ApplicationInfo({ application }: ApplicationInfoProps) {
    const { coverLetter, resumeUrl, job, candidateProfile, candidate } = application;

    const { data: specialtiesData } = useGetSpecialties(1, 100);
    const { data: qualificationsData } = useGetQualifications(1, 100);

    const specialties = specialtiesData?.items || [];
    const qualifications = qualificationsData?.items || [];

    const getSpecialtyName = (id: string) => specialties.find(s => s.id === id)?.name || id;
    const getQualificationName = (id: string) => qualifications.find(q => q.id === id)?.name || id;

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content - Takes 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Candidate Profile Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b bg-muted/30">
                            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-primary" />
                                Candidate Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <span className="text-2xl sm:text-3xl font-bold">
                                        {(application.candidateProfile?.fullName || application.candidate?.email || '?')[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-4 w-full">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                                            {application.candidateProfile?.fullName || application.candidate?.email || 'N/A'}
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                <Mail className="h-3.5 w-3.5" /> Email
                                            </p>
                                            <p className="text-sm font-medium text-foreground break-all">{candidate?.email || 'N/A'}</p>
                                        </div>
                                        {candidateProfile?.phone && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                    <Phone className="h-3.5 w-3.5" /> Phone
                                                </p>
                                                <p className="text-sm font-medium text-foreground">{candidateProfile.phone}</p>
                                            </div>
                                        )}
                                        {(candidateProfile?.city || candidateProfile?.country) && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5" /> Location
                                                </p>
                                                <p className="text-sm font-medium text-foreground">
                                                    {[candidateProfile.city, candidateProfile.country]
                                                        .filter(Boolean)
                                                        .join(', ')}
                                                </p>
                                            </div>
                                        )}
                                        {candidateProfile?.experienceYears !== undefined && candidateProfile?.experienceYears !== null && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                    <Briefcase className="h-3.5 w-3.5" /> Experience
                                                </p>
                                                <p className="text-sm font-medium text-foreground">{candidateProfile.experienceYears} years</p>
                                            </div>
                                        )}
                                        {candidateProfile?.dob && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" /> Date of Birth
                                                </p>
                                                <p className="text-sm font-medium text-foreground">{format(new Date(candidateProfile.dob), 'MMM d, yyyy')}</p>
                                            </div>
                                        )}
                                        {candidateProfile?.gender && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                                    <UserIcon className="h-3.5 w-3.5" /> Gender
                                                </p>
                                                <p className="text-sm font-medium text-foreground capitalize">{candidateProfile.gender}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {(candidateProfile?.specialties?.length || candidateProfile?.qualifications?.length) ? (
                                <Separator className="my-4" />
                            ) : null}

                            <div className="grid grid-cols-1 gap-4">
                                {candidateProfile?.specialties && candidateProfile.specialties.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground">Specialties</p>
                                        <div className="flex flex-wrap gap-2">
                                            {candidateProfile.specialties.map((specialtyId, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {getSpecialtyName(specialtyId)}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {candidateProfile?.qualifications && candidateProfile.qualifications.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground">Qualifications</p>
                                        <div className="flex flex-wrap gap-2">
                                            {candidateProfile.qualifications.map((qualId, i) => (
                                                <Badge key={i} variant="outline" className="text-xs">
                                                    {getQualificationName(qualId)}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {candidateProfile?.summary && (
                        <Card>
                            <CardHeader className="border-b bg-muted/30">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Professional Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                    {candidateProfile.summary}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {candidateProfile?.licenseNumbers && candidateProfile.licenseNumbers.length > 0 && (
                        <Card>
                            <CardHeader className="border-b bg-muted/30">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                    Medical Licenses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-wrap gap-2">
                                    {candidateProfile.licenseNumbers.map((license, idx) => (
                                        <Badge key={idx} variant="outline" className="font-mono text-xs">
                                            {license}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {candidateProfile?.socialLinks && Object.keys(candidateProfile.socialLinks).length > 0 && (
                        <Card>
                            <CardHeader className="border-b bg-muted/30">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <LinkIcon className="h-5 w-5 text-primary" />
                                    Professional Links
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    {Object.entries(candidateProfile.socialLinks).map(([platform, url]) => (
                                        <Button
                                            key={platform}
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="text-xs sm:text-sm"
                                        >
                                            <a
                                                href={url as string}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5"
                                            >
                                                <span className="capitalize">{platform}</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {coverLetter && (
                        <Card>
                            <CardHeader className="border-b bg-muted/30">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Cover Letter
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                    {coverLetter}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader className="border-b bg-muted/30">
                            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Resume
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                            {resumeUrl ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border bg-muted/30">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Candidate Resume</p>
                                            <p className="text-xs text-muted-foreground">PDF Document</p>
                                        </div>
                                    </div>
                                    <Button variant="default" size="sm" asChild className="w-full sm:w-auto">
                                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                            <span>View Resume</span>
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No resume attached.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Job Details */}
                <div className="lg:col-span-1 space-y-6">
                    {job && (
                        <Card className="lg:sticky lg:top-24">
                            <CardHeader className="border-b bg-muted/30">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    Applied Job
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 space-y-4">
                                <div className="space-y-2">
                                    <h3 className="font-bold text-base sm:text-lg text-foreground leading-tight">{job.title}</h3>
                                    {job.organization?.name && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Building2 className="h-3.5 w-3.5" />
                                            <span>{job.organization.name}</span>
                                        </div>
                                    )}
                                    {job.location && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <span>{job.location.city}, {job.location.country}</span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div>
                                    <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                                        {job.description}
                                    </p>
                                </div>

                                {job.requirements && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-sm text-foreground">Key Requirements</h4>
                                            <div className="text-sm text-muted-foreground">
                                                {Array.isArray(job.requirements) ? (
                                                    <ul className="space-y-1.5">
                                                        {job.requirements.slice(0, 3).map((req, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                                <span className="text-xs leading-relaxed">{req}</span>
                                                            </li>
                                                        ))}
                                                        {job.requirements.length > 3 && (
                                                            <li className="text-xs italic text-muted-foreground/70 pl-3.5">
                                                                +{job.requirements.length - 3} more
                                                            </li>
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <p className="text-xs line-clamp-3 leading-relaxed">{job.requirements}</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <Button className="w-full" asChild>
                                    <Link href={`/jobs/${job.id}`} className="flex items-center gap-2">
                                        <span>View Full Details</span>
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
