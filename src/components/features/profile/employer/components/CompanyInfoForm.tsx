import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';

interface CompanyInfoFormProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    watch: UseFormWatch<any>;
}

export function CompanyInfoForm({ register, errors, watch }: CompanyInfoFormProps) {
    return (
        <Card className="glass-enhanced transition-all duration-300">
            <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                    Update your company details and contact information
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="companyName">Company/Hospital Name *</Label>
                    <Input
                        id="companyName"
                        {...register('companyName')}
                        aria-invalid={!!errors.companyName}
                    />
                    {errors.companyName && (
                        <p className="text-sm text-destructive">{errors.companyName.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                    <Input
                        id="contactPersonName"
                        {...register('contactPersonName')}
                        aria-invalid={!!errors.contactPersonName}
                    />
                    {errors.contactPersonName && (
                        <p className="text-sm text-destructive">{errors.contactPersonName.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone Number *</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        {...register('phone')}
                        aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <Input
                        id="companyWebsite"
                        type="url"
                        placeholder="https://www.example.com"
                        {...register('companyWebsite')}
                        aria-invalid={!!errors.companyWebsite}
                    />
                    {errors.companyWebsite && (
                        <p className="text-sm text-destructive">{errors.companyWebsite.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="companyDescription">Company Description</Label>
                    <Textarea
                        id="companyDescription"
                        rows={6}
                        placeholder="Describe your organization, values, and what makes it a great place to work..."
                        {...register('companyDescription')}
                        aria-invalid={!!errors.companyDescription}
                    />
                    <p className="text-xs text-muted-foreground">
                        {watch('companyDescription')?.length || 0}/1000 characters
                    </p>
                    {errors.companyDescription && (
                        <p className="text-sm text-destructive">{errors.companyDescription.message as string}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
