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
        <div className="max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-12">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Candidate Overview Card */}
                    <Card className="overflow-hidden border-none bg-secondary/10">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <span className="text-3xl font-bold">
                                        {(application.candidateProfile?.fullName || application.candidate?.email || '?')[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">
                                            {application.candidateProfile?.fullName || application.candidate?.email || 'N/A'}
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> Email
                                            </p>
                                            <p className="text-sm font-medium">{candidate?.email || 'N/A'}</p>
                                        </div>
                                        {candidateProfile?.phone && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                                    <Phone className="h-3 w-3" /> Phone
                                                </p>
                                                <p className="text-sm font-medium">{candidateProfile.phone}</p>
                                            </div>
                                        )}
                                        {(candidateProfile?.city || candidateProfile?.country) && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> Location
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {[candidateProfile.city, candidateProfile.country]
                                                        .filter(Boolean)
                                                        .join(', ')}
                                                </p>
                                            </div>
                                        )}
                                        {candidateProfile?.experienceYears !== undefined && candidateProfile?.experienceYears !== null && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                                    <Briefcase className="h-3 w-3" /> Experience
                                                </p>
                                                <p className="text-sm font-medium">{candidateProfile.experienceYears} years</p>
                                            </div>
                                        )}
                                        {candidateProfile?.dob && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Date of Birth
                                                </p>
                                                <p className="text-sm font-medium">{format(new Date(candidateProfile.dob), 'MMM d, yyyy')}</p>
                                            </div>
                                        )}
                                        {candidateProfile?.gender && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                                    <UserIcon className="h-3 w-3" /> Gender
                                                </p>
                                                <p className="text-sm font-medium capitalize">{candidateProfile.gender}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-2">
                                        {candidateProfile?.specialties && candidateProfile.specialties.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Specialties</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {candidateProfile.specialties.map((specialtyId, i) => (
                                                        <Badge key={i} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                                                            {getSpecialtyName(specialtyId)}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {candidateProfile?.qualifications && candidateProfile.qualifications.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Qualifications</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {candidateProfile.qualifications.map((qualId, i) => (
                                                        <Badge key={i} variant="secondary" className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 border-0">
                                                            {getQualificationName(qualId)}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Bio */}
                    {candidateProfile?.summary && (
                        <Card className="border-none shadow-sm">
                            <CardHeader className="border-b bg-muted/30">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <UserIcon className="h-5 w-5 text-primary" />
                                    Professional Bio
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                    {candidateProfile.summary}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Professional Credentials */}
                    {(candidateProfile?.qualifications?.length || candidateProfile?.licenseNumbers?.length) ? (
                        <Card className="border-none shadow-sm">
                            <CardHeader className="border-b bg-muted/30">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                    Professional Credentials
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                {candidateProfile.qualifications && candidateProfile.qualifications.length > 0 && (
                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Qualifications</p>
                                        <div className="flex flex-wrap gap-2">
                                            {candidateProfile.qualifications.map((qualId, idx) => (
                                                <Badge key={idx} variant="secondary">
                                                    {getQualificationName(qualId)}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {candidateProfile.qualifications?.length && candidateProfile.licenseNumbers?.length ? <Separator /> : null}

                                {candidateProfile.licenseNumbers && candidateProfile.licenseNumbers.length > 0 && (
                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Medical License Numbers</p>
                                        <div className="flex flex-wrap gap-2">
                                            {candidateProfile.licenseNumbers.map((license, idx) => (
                                                <Badge key={idx} variant="outline" className="font-mono">
                                                    {license}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : null}

                    {/* Social Links */}
                    {candidateProfile?.socialLinks && Object.keys(candidateProfile.socialLinks).length > 0 && (
                        <Card className="border-none shadow-sm">
                            <CardHeader className="border-b bg-muted/30">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <LinkIcon className="h-5 w-5 text-primary" />
                                    Social Links
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="flex flex-wrap gap-4">
                                    {Object.entries(candidateProfile.socialLinks).map(([platform, url]) => (
                                        <a
                                            key={platform}
                                            href={url as string}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm font-medium"
                                        >
                                            <span className="capitalize">{platform}</span>
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Cover Letter */}

                    {/* Resume Section */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="border-b bg-muted/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Resume
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            {resumeUrl ? (
                                <div className="flex items-center justify-between p-4 rounded-xl border bg-secondary/5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Candidate Resume</p>
                                            <p className="text-xs text-muted-foreground">PDF Document</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                            View Resume
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">
                                    No resume attached.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    {job && (
                        <Card className="border-none shadow-sm sticky top-24">
                            <CardHeader className="border-b bg-muted/30">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    Job Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h3 className="font-bold text-base mb-2">{job.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-6 leading-relaxed">
                                        {job.description}
                                    </p>
                                </div>

                                {job.requirements && (
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm">Requirements</h4>
                                        <div className="text-sm text-muted-foreground">
                                            {Array.isArray(job.requirements) ? (
                                                <ul className="space-y-2">
                                                    {job.requirements.slice(0, 3).map((req, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                            <span>{req}</span>
                                                        </li>
                                                    ))}
                                                    {job.requirements.length > 3 && (
                                                        <li className="text-xs italic pl-3.5">
                                                            + {job.requirements.length - 3} more requirements
                                                        </li>
                                                    )}
                                                </ul>
                                            ) : (
                                                <p className="line-clamp-3">{job.requirements}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t">
                                    <Button className="w-full group" asChild>
                                        <Link href={`/jobs/${job.id}`}>
                                            View Full Job Details
                                            <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
