import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanyInfoCardProps {
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

export function CompanyInfoCard({
    website,
    address,
    city,
    state,
    country,
    postalCode,
}: CompanyInfoCardProps) {
    const hasAnyInfo = website || address || city || state || country || postalCode;

    if (!hasAnyInfo) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Organization details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {website && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Website</p>
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all"
                        >
                            {website}
                        </a>
                    </div>
                )}
                {address && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p className="text-sm">{address}</p>
                        {(city || state || country) && (
                            <p className="text-sm">
                                {[city, state, country, postalCode].filter(Boolean).join(', ')}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
