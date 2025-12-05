import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gender } from '@/types';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';

interface PersonalInfoStepProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    setValue: UseFormSetValue<any>;
}

export function PersonalInfoStep({ register, errors, setValue }: PersonalInfoStepProps) {
    return (
        <>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                        id="firstName"
                        {...register('firstName')}
                        aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                        id="lastName"
                        {...register('lastName')}
                        aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName.message as string}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
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
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                    onValueChange={(value) => setValue('gender', value as Gender)}
                >
                    <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={Gender.male}>Male</SelectItem>
                        <SelectItem value={Gender.female}>Female</SelectItem>
                        <SelectItem value={Gender.other}>Other</SelectItem>
                        <SelectItem value={Gender.prefer_not_say}>Prefer not to say</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </>
    );
}
