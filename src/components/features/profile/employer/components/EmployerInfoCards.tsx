import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, User, MapPin } from 'lucide-react';

interface EmployerInfoCardsProps {
    email: string;
    phone?: string;
    contactPerson?: string;
    city?: string;
    country?: string;
}

export function EmployerInfoCards({
    email,
    phone,
    contactPerson,
    city,
    country,
}: EmployerInfoCardsProps) {
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

            {contactPerson && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Contact Person
                        </CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">{contactPerson}</div>
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
