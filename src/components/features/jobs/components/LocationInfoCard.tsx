import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LocationInfoCardProps {
    city: string;
    state?: string;
    country: string;
    latitude?: number;
    longitude?: number;
}

export const LocationInfoCard = ({
    city,
    state,
    country,
    latitude,
    longitude,
}: LocationInfoCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Job Location</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
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
