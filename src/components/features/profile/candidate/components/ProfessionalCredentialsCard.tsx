import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ProfessionalCredentialsCardProps {
    licenseNumbers?: string[];
    qualifications?: string[];
    specialties?: any[]; // Using any[] for now as we might get objects or strings, ideally should be typed properly
}

export function ProfessionalCredentialsCard({
    licenseNumbers,
    qualifications,
    specialties
}: ProfessionalCredentialsCardProps) {
    return (
        <Card className="glass-enhanced transition-all duration-300 hover:shadow-xl">
            <CardHeader>
                <CardTitle>Professional Credentials</CardTitle>
                <CardDescription>License, certifications, and specialties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {licenseNumbers && licenseNumbers.length > 0 && (
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
                )}

                {(licenseNumbers?.length ?? 0) > 0 && ((qualifications?.length ?? 0) > 0 || (specialties?.length ?? 0) > 0) && (
                    <Separator />
                )}

                {qualifications && qualifications.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Qualifications</p>
                        <div className="flex flex-wrap gap-2">
                            {qualifications.map((qual, idx) => (
                                <Badge key={idx} variant="secondary">
                                    {qual}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {((qualifications?.length ?? 0) > 0) && ((specialties?.length ?? 0) > 0) && (
                    <Separator />
                )}

                {specialties && specialties.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Specialties</p>
                        <div className="flex flex-wrap gap-2">
                            {specialties.map((spec, idx) => {
                                // Handle both string IDs (if that's what's returned) or objects
                                const label = typeof spec === 'string' ? spec : (spec.name || spec.label || JSON.stringify(spec));
                                return (
                                    <Badge key={idx} className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                                        {label}
                                    </Badge>
                                );
                            })}
                        </div>
                    </div>
                )}

                {(!licenseNumbers?.length && !qualifications?.length && !specialties?.length) && (
                    <p className="text-sm text-muted-foreground">No credentials information added</p>
                )}
            </CardContent>
        </Card>
    );
}
