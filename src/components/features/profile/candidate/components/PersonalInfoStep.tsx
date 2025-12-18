import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Gender } from '@/types';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface PersonalInfoStepProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    setValue: UseFormSetValue<any>;
    watch: UseFormWatch<any>;
}

export function PersonalInfoStep({ register, errors, setValue, watch }: PersonalInfoStepProps) {
    const [dateOfBirth, setDateOfBirth] = React.useState<Date | undefined>(undefined);

    const watchedDob = watch('dateOfBirth');

    React.useEffect(() => {
        if (!watchedDob) {
            setDateOfBirth(undefined);
            return;
        }

        const parsed = new Date(watchedDob + 'T00:00:00');
        if (!isNaN(parsed.getTime())) {
            setDateOfBirth(parsed);
        }
    }, [watchedDob]);

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
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                    id="displayName"
                    {...register('displayName')}
                    aria-invalid={!!errors.displayName}
                />
                {errors.displayName && (
                    <p className="text-sm text-destructive">{errors.displayName.message as string}</p>
                )}
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
                <Label>Date of Birth</Label>
                <div className="grid grid-cols-3 gap-2">
                    <Select
                        value={dateOfBirth ? dateOfBirth.getMonth().toString() : ''}
                        onValueChange={(value) => {
                            const newDate = dateOfBirth ? new Date(dateOfBirth) : new Date();
                            newDate.setMonth(parseInt(value));
                            setDateOfBirth(newDate);
                            const iso = newDate.toISOString().split('T')[0];
                            setValue('dateOfBirth', iso, { shouldValidate: true });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i} value={i.toString()}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={dateOfBirth ? dateOfBirth.getFullYear().toString() : ''}
                        onValueChange={(value) => {
                            const newDate = dateOfBirth ? new Date(dateOfBirth) : new Date();
                            newDate.setFullYear(parseInt(value));
                            setDateOfBirth(newDate);
                            const iso = newDate.toISOString().split('T')[0];
                            setValue('dateOfBirth', iso, { shouldValidate: true });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={dateOfBirth ? dateOfBirth.getDate().toString() : ''}
                        onValueChange={(value) => {
                            const newDate = dateOfBirth ? new Date(dateOfBirth) : new Date();
                            newDate.setDate(parseInt(value));
                            setDateOfBirth(newDate);
                            const iso = newDate.toISOString().split('T')[0];
                            setValue('dateOfBirth', iso, { shouldValidate: true });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                <SelectItem key={day} value={day.toString()}>
                                    {day}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <input type="hidden" {...register('dateOfBirth')} />
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
