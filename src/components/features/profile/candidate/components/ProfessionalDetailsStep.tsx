import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';

interface ProfessionalDetailsStepProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    watch: UseFormWatch<any>;
}

export function ProfessionalDetailsStep({ register, errors, watch }: ProfessionalDetailsStepProps) {
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="licenseNumber">Medical License Number *</Label>
                <Input
                    id="licenseNumber"
                    {...register('licenseNumber')}
                    aria-invalid={!!errors.licenseNumber}
                />
                {errors.licenseNumber && (
                    <p className="text-sm text-destructive">{errors.licenseNumber.message as string}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                <Input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    {...register('yearsOfExperience')}
                    aria-invalid={!!errors.yearsOfExperience}
                />
                {errors.yearsOfExperience && (
                    <p className="text-sm text-destructive">{errors.yearsOfExperience.message as string}</p>
                )}
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
        </>
    );
}
