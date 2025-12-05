import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface CompanyLocationFormProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
}

export function CompanyLocationForm({ register, errors }: CompanyLocationFormProps) {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>
                    Update your company location information
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                        id="address"
                        {...register('address')}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            {...register('city')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                            id="state"
                            {...register('state')}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                            id="country"
                            {...register('country')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                            id="postalCode"
                            {...register('postalCode')}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
