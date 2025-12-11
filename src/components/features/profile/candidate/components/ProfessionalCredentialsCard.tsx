import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfessionalCredentialsCardProps {
    licenseNumbers?: string[];
}

export function ProfessionalCredentialsCard({ licenseNumbers }: ProfessionalCredentialsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Professional Credentials</CardTitle>
                <CardDescription>License and certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {licenseNumbers && licenseNumbers.length > 0 ? (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Medical License Numbers</p>
                        <div className="flex flex-wrap gap-2">
                            {licenseNumbers.map((license, idx) => (
                                <Badge key={idx} variant="outline" className="font-mono">
                                    {license}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No license information added</p>
                )}
            </CardContent>
        </Card>
    );
}
