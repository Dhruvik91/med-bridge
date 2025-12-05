import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface CompanyInfoStepProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
}

export function CompanyInfoStep({ register, errors }: CompanyInfoStepProps) {
    return (
        <>
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
        </>
    );
}
