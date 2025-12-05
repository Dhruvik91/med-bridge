import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';

interface ProfessionalDetailsFormProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    watch: UseFormWatch<any>;
}

export function ProfessionalDetailsForm({ register, errors, watch }: ProfessionalDetailsFormProps) {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Professional Details</CardTitle>
                <CardDescription>
                    Update your medical credentials and experience
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Medical License Number</Label>
                    <Input
                        id="licenseNumber"
                        {...register('licenseNumber')}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input
                        id="yearsOfExperience"
                        type="number"
                        min="0"
                        {...register('yearsOfExperience')}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                        id="bio"
                        rows={5}
                        placeholder="Tell employers about your experience, specializations, and career goals..."
                        {...register('bio')}
                        aria-invalid={!!errors.bio}
                    />
                    <p className="text-xs text-muted-foreground">
                        {watch('bio')?.length || 0}/500 characters
                    </p>
                    {errors.bio && (
                        <p className="text-sm text-destructive">{errors.bio.message as string}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
