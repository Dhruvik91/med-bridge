import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmployerInfoCardProps {
    name: string;
    description?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    website?: string;
}

export const EmployerInfoCard = ({
    name,
    description,
    contactPerson,
    phone,
    email,
    address,
    city,
    state,
    country,
    postalCode,
    website,
}: EmployerInfoCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>About the Employer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-1">{name}</h4>
                    {description && (
                        <p className="text-sm text-muted-foreground line-clamp-4">
                            {description}
                        </p>
                    )}
                </div>

                {/* Contact Information */}
                {(contactPerson || phone || email) && (
                    <div className="space-y-2 text-sm">
                        {contactPerson && (
                            <div>
                                <span className="font-medium">Contact Person: </span>
                                <span className="text-muted-foreground">{contactPerson}</span>
                            </div>
                        )}
                        {phone && (
                            <div>
                                <span className="font-medium">Phone: </span>
                                <a href={`tel:${phone}`} className="text-primary hover:underline">
                                    {phone}
                                </a>
                            </div>
                        )}
                        {email && (
                            <div>
                                <span className="font-medium">Email: </span>
                                <a href={`mailto:${email}`} className="text-primary hover:underline">
                                    {email}
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {/* Address */}
                {(address || city) && (
                    <div className="text-sm">
                        <span className="font-medium">Address: </span>
                        <p className="text-muted-foreground">
                            {address && `${address}, `}
                            {city && `${city}, `}
                            {state && `${state}, `}
                            {country}
                            {postalCode && ` - ${postalCode}`}
                        </p>
                    </div>
                )}

                {website && (
                    <Button asChild variant="outline" className="w-full" size="sm">
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Visit Website
                        </a>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};
