import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PersonalInfoCardProps {
    dob?: string;
    gender?: string;
    address?: string;
}

export function PersonalInfoCard({ dob, gender, address }: PersonalInfoCardProps) {
    const hasAnyInfo = dob || gender || address;

    if (!hasAnyInfo) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {dob && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                        <p className="text-sm">
                            {new Date(dob).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                )}
                {gender && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Gender</p>
                        <p className="text-sm capitalize">{gender.replace('_', ' ')}</p>
                    </div>
                )}
                {address && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p className="text-sm">{address}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
