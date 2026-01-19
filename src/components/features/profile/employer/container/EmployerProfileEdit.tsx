'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useUpdateEmployerProfile } from '@/hooks/update/useUpdateEmployerProfile';
import { UpdateEmployerProfileDto, UserRole } from '@/types';
import { CompanyInfoForm } from '../components/CompanyInfoForm';
import { CompanyLocationForm } from '../components/CompanyLocationForm';

const profileSchema = z.object({
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    contactPersonName: z.string().min(2, 'Contact person name is required'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    companyWebsite: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    companyDescription: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function EmployerProfileEdit() {
    const router = useRouter();
    const [error, setError] = useState('');

    const { data: user, isLoading: userLoading } = useGetMe();
    const { data: profile, isLoading: profileLoading } = useGetEmployerProfile(user);
    const updateProfileMutation = useUpdateEmployerProfile(profile?.id || '');

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
    });

    // Pre-populate form with existing profile data
    useEffect(() => {
        if (profile) {
            reset({
                companyName: profile.name || '',
                contactPersonName: profile.contactPerson || '',
                phone: profile.phone || '',
                companyWebsite: profile.website || '',
                companyDescription: profile.description || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                country: profile.country || '',
                postalCode: profile.postalCode || '',
            });
        }
    }, [profile, reset]);

    const onSubmit = (data: ProfileForm) => {
        if (!profile) return;

        const profileData: UpdateEmployerProfileDto = {
            name: data.companyName,
            contactPerson: data.contactPersonName,
            phone: data.phone,
            website: data.companyWebsite || undefined,
            description: data.companyDescription,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            postalCode: data.postalCode,
        };

        updateProfileMutation.mutate(profileData);
    };

    if (userLoading || profileLoading) {
        return (
            <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
                <div>
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

    if (!user || user.role !== UserRole.employer) {
        return (
            <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
                <div>
                    <Alert variant="destructive">
                        <AlertDescription>
                            You don't have access to this page. Please sign in as an employer.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
                <div>
                    <Alert>
                        <AlertDescription>
                            No profile found. Please complete your profile first.
                        </AlertDescription>
                    </Alert>
                    <Button asChild className="mt-4">
                        <Link href="/profile/employer/complete">Complete Profile</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
            <div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Edit Company Profile</h1>
                    <p className="text-muted-foreground mt-1">
                        Update your company information
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CompanyInfoForm
                        register={register}
                        errors={errors}
                        watch={watch}
                    />

                    <CompanyLocationForm
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
