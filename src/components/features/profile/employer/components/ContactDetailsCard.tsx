import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ContactDetailsCardProps {
    contactPerson?: string;
    phone?: string;
}

export function ContactDetailsCard({ contactPerson, phone }: ContactDetailsCardProps) {
    const hasAnyInfo = contactPerson || phone;

    if (!hasAnyInfo) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact Details</CardTitle>
                <CardDescription>How to reach us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {contactPerson && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Primary Contact</p>
                        <p className="text-sm">{contactPerson}</p>
                    </div>
                )}
                {phone && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                        <p className="text-sm">{phone}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
