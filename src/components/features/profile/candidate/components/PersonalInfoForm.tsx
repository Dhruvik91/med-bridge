import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gender } from '@/types';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';

interface PersonalInfoFormProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
}

export function PersonalInfoForm({ register, errors, watch, setValue }: PersonalInfoFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                    Update your basic information and contact details
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                        id="fullName"
                        {...register('fullName')}
                        aria-invalid={!!errors.fullName}
                    />
                    {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name (Optional)</Label>
                    <Input
                        id="displayName"
                        placeholder="How you'd like to be called"
                        {...register('displayName')}
                    />
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
                        value={watch('gender')}
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
            </CardContent>
        </Card>
    );
}
