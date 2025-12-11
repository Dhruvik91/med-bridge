import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Briefcase } from 'lucide-react';

interface CandidateInfoCardsProps {
    email: string;
    phone?: string;
    experienceYears?: number;
    city?: string;
    country?: string;
}

export function CandidateInfoCards({
    email,
    phone,
    experienceYears,
    city,
    country,
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
                    <div className="text-sm font-medium">{email}</div>
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
        </div>
    );
}
