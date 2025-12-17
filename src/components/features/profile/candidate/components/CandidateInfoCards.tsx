import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Briefcase, Link as LinkIcon, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CandidateInfoCardsProps {
    email: string;
    phone?: string;
    experienceYears?: number;
    city?: string;
    country?: string;
    socialLinks?: Record<string, string>;
    resumeUrl?: string;
}

export function CandidateInfoCards({
    email,
    phone,
    experienceYears,
    city,
    country,
    socialLinks,
    resumeUrl,
}: CandidateInfoCardsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Email
                    </CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-sm font-medium truncate" title={email}>{email}</div>
                </CardContent>
            </Card>

            {phone && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Phone
                        </CardTitle>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">{phone}</div>
                    </CardContent>
                </Card>
            )}

            {experienceYears !== undefined && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Experience
                        </CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{experienceYears}</div>
                        <p className="text-xs text-muted-foreground">years</p>
                    </CardContent>
                </Card>
            )}

            {(city || country) && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Location
                        </CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {[city, country].filter(Boolean).join(', ')}
                        </div>
                    </CardContent>
                </Card>
            )}

            {socialLinks && Object.keys(socialLinks).length > 0 && (
                <Card className="md:col-span-2 lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Social Links
                        </CardTitle>
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(socialLinks).map(([platform, url]) => (
                                <Link
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1 capitalize"
                                >
                                    {platform} <ExternalLink className="h-3 w-3" />
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {resumeUrl && (
                <Card className="md:col-span-2 lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Resume
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                            <Link href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                View Resume <ExternalLink className="ml-2 h-3 w-3" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
