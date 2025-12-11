import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';

interface CompanyDetailsStepProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    watch: UseFormWatch<any>;
}

export function CompanyDetailsStep({ register, errors, watch }: CompanyDetailsStepProps) {
    return (
        <>
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
        </>
    );
}
