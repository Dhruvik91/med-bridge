'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as z from 'zod';
import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { NotAuthorizedUser } from '@/components/NotAuthorized';
import { LocationForm } from '../components/LocationForm';
import { PersonalInfoForm } from '../components/PersonalInfoForm';
import { ProfessionalDetailsForm } from '../components/ProfessionalDetailsForm';

import { zodResolver } from '@hookform/resolvers/zod';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetDoctorProfile } from '@/hooks/get/useGetDoctorProfile';
import { useUpdateDoctorProfile } from '@/hooks/update/useUpdateDoctorProfile';

import { FRONTEND_ROUTES } from '@/constants/constants';
import { Gender, UpdateDoctorProfileDto, UserRole } from '@/types';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    displayName: z.string().optional(),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    dateOfBirth: z.string().optional(),
    gender: z.nativeEnum(Gender).optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    licenseNumber: z.string().optional(),
    yearsOfExperience: z.coerce.number().int().min(0).default(0),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function DoctorProfileEdit() {
    const router = useRouter();
    const [error, setError] = useState('');

    const { data: user, isLoading: userLoading } = useGetMe();
    const { data: profile, isLoading: profileLoading } = useGetDoctorProfile(user?.id || '');
    const updateProfileMutation = useUpdateDoctorProfile(profile?.id || '');

    const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
    });

    // Pre-populate form with existing profile data
    useEffect(() => {
        if (profile) {
            reset({
                fullName: profile.fullName || '',
                displayName: profile.displayName || '',
                phone: profile.phone || '',
                dateOfBirth: profile.dob || '',
                gender: profile.gender || undefined,
                bio: profile.summary || '',
                licenseNumber: profile.licenseNumbers?.[0] || '',
                yearsOfExperience: profile.experienceYears || 0,
                address: profile.address || '',
                city: profile.city || '',
                state: '',
                country: profile.country || '',
                postalCode: '',
            });
        }
    }, [profile, reset]);

    const onSubmit = (data: ProfileForm) => {
        if (!profile) return;

        const profileData: UpdateDoctorProfileDto = {
            fullName: data.fullName,
            displayName: data.displayName || undefined,
            phone: data.phone,
            dob: data.dateOfBirth,
            gender: data.gender,
            summary: data.bio,
            licenseNumbers: data.licenseNumber ? [data.licenseNumber] : undefined,
            experienceYears: data.yearsOfExperience,
            address: data.address,
            city: data.city,
            country: data.country,
        };

        updateProfileMutation.mutate(profileData);
    };

    if (userLoading || profileLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 py-12 px-4">
                <div className="container mx-auto max-w-2xl">
                    <Skeleton className="h-12 w-64 mb-8" />
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-48" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Skeleton key={i} className="h-20" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!user || user.role !== UserRole.candidate) {
        return (
            <NotAuthorizedUser userType={user?.role} />
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 py-12 px-4">
                <div className="container mx-auto max-w-2xl">
                    <Alert>
                        <AlertDescription>
                            No profile found. Please complete your profile first.
                        </AlertDescription>
                    </Alert>
                    <Button asChild className="mt-4">
                        <Link href={FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE}>Complete Profile</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Edit Your Profile</h1>
                    <p className="text-muted-foreground mt-1">
                        Update your professional information
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <PersonalInfoForm
                        register={register}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                    />

                    <ProfessionalDetailsForm
                        register={register}
                        errors={errors}
                        watch={watch}
                    />

                    <LocationForm
                        register={register}
                        errors={errors}
                    />

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-6 gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                        >
                            {updateProfileMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
