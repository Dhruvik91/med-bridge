import React from 'react';
import { Application } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ApplicationInfoProps {
    application: Application;
}

export function ApplicationInfo({ application }: ApplicationInfoProps) {
    const { coverLetter, resumeUrl, job } = application;

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Cover Letter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {coverLetter ? (
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                {coverLetter}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                No cover letter provided.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Resume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {resumeUrl ? (
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Resume
                                </a>
                            </Button>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                No resume attached.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Candidate Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-medium text-sm mb-1">Name</h4>
                            <p className="text-sm text-muted-foreground">
                                {application.candidateProfile?.fullName || application.candidate?.email || 'N/A'}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-medium text-sm mb-1">Email</h4>
                            <p className="text-sm text-muted-foreground">
                                {application.candidate?.email || 'N/A'}
                            </p>
                        </div>

                        {application.candidateProfile?.phone && (
                            <div>
                                <h4 className="font-medium text-sm mb-1">Phone</h4>
                                <p className="text-sm text-muted-foreground">
                                    {application.candidateProfile.phone}
                                </p>
                            </div>
                        )}

                        {(application.candidateProfile?.city || application.candidateProfile?.country) && (
                            <div>
                                <h4 className="font-medium text-sm mb-1">Location</h4>
                                <p className="text-sm text-muted-foreground">
                                    {[application.candidateProfile.city, application.candidateProfile.country]
                                        .filter(Boolean)
                                        .join(', ')}
                                </p>
                            </div>
                        )}

                        {application.candidateProfile?.experienceYears !== undefined && application.candidateProfile?.experienceYears !== null && (
                            <div>
                                <h4 className="font-medium text-sm mb-1">Experience</h4>
                                <p className="text-sm text-muted-foreground">
                                    {application.candidateProfile.experienceYears} years
                                </p>
                            </div>
                        )}

                        {application.candidateProfile?.specialties && application.candidateProfile.specialties.length > 0 && (
                            <div>
                                <h4 className="font-medium text-sm mb-1">Specialties</h4>
                                <div className="flex flex-wrap gap-1">
                                    {application.candidateProfile.specialties.map((specialty, i) => (
                                        <span key={i} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {job && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Job Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium text-sm mb-1">Description</h4>
                                <p className="text-sm text-muted-foreground line-clamp-4">
                                    {job.description}
                                </p>
                            </div>

                            {job.requirements && (
                                <div>
                                    <h4 className="font-medium text-sm mb-1">Requirements</h4>
                                    <div className="text-sm text-muted-foreground line-clamp-4">
                                        {Array.isArray(job.requirements) ? (
                                            <ul className="list-disc list-inside">
                                                {job.requirements.map((req, i) => (
                                                    <li key={i}>{req}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>{job.requirements}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <Button variant="secondary" className="w-full" asChild>
                                    <Link href={`/jobs/${job.id}`}>
                                        View Full Job Description
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
