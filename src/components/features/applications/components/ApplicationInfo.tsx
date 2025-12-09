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
        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Cover Letter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {coverLetter ? (
                            <p className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
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
                {job && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Job Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium text-sm text-gray-900">Description</h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-4">
                                    {job.description}
                                </p>
                            </div>

                            {job.requirements && (
                                <div>
                                    <h4 className="font-medium text-sm text-gray-900">Requirements</h4>
                                    <div className="text-sm text-gray-600 mt-1 line-clamp-4">
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
