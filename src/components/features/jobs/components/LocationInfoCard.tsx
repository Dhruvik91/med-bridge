import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LocationInfoCardProps {
    city: string;
    state?: string;
    country: string;
    latitude?: number;
    longitude?: number;
    remote?: boolean;
}

export const LocationInfoCard = ({
    city,
    state,
    country,
    latitude,
    longitude,
    remote,
}: LocationInfoCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Job Location</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    {remote && (
                        <Badge variant="secondary" className="mb-2">Remote Position</Badge>
                    )}
                    <p className="font-medium">
                        {city}
                        {state && `, ${state}`}
                    </p>
                    <p className="text-muted-foreground">{country}</p>
                    {(latitude && longitude) && (
                        <p className="text-xs text-muted-foreground">
                            Coordinates: {latitude}, {longitude}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
