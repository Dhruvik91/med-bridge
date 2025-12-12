import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
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
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>{dateOfBirth ? format(dateOfBirth, 'PPP') : 'Pick a date'}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={dateOfBirth}
                            onSelect={(date) => {
                                setDateOfBirth(date);
                                if (!date) return;
                                const iso = date.toISOString().split('T')[0];
                                setValue('dateOfBirth', iso, { shouldValidate: true });
                            }}
                        />
                    </PopoverContent>
                </Popover>
                <input type="hidden" id="dateOfBirth" {...register('dateOfBirth')} />
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
