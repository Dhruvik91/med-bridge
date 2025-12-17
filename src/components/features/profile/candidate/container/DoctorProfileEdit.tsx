'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { NotAuthorizedUser } from '@/components/NotAuthorized';

import { PersonalInfoStep } from '../components/PersonalInfoStep';
import { ProfessionalDetailsStep } from '../components/ProfessionalDetailsStep';
import { LocationStep } from '../components/LocationStep';

import { zodResolver } from '@hookform/resolvers/zod';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetDoctorProfile } from '@/hooks/get/useGetDoctorProfile';
import { useUpdateDoctorProfile } from '@/hooks/update/useUpdateDoctorProfile';
import { useGetSpecialties } from '@/hooks/get/useGetSpecialties';
import { useUploadFile } from '@/hooks/post/useUploadFile';
import { useSpecialtySelection } from '@/hooks/useSpecialtySelection';
import { useAddSpecialtyModal } from '@/hooks/useAddSpecialtyModal';

import { Gender, UpdateDoctorProfileDto, UserRole } from '@/types';

const profileSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    displayName: z.string().optional(),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    dateOfBirth: z.string().optional(),
    gender: z.nativeEnum(Gender).optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    licenseNumber: z.string().optional(),
    yearsOfExperience: z
        .union([z.string(), z.number()])
        .optional()
        .transform((val) => {
            if (val === undefined || val === null || val === '') return 0;
            const num = typeof val === 'number' ? val : parseInt(val, 10);
            return Number.isNaN(num) ? 0 : num;
        }),
    qualificationsRaw: z.string().optional(),
    avatarUrl: z.string().optional(),
    resumeUrl: z.string().optional(),
    address: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().optional(),
    country: z.string().min(2, 'Country is required'),
    postalCode: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const steps = [
    { title: 'Personal Information', fields: ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender'] },
    { title: 'Professional Details', fields: ['licenseNumber', 'yearsOfExperience', 'bio'] },
    { title: 'Location', fields: ['address', 'city', 'state', 'country', 'postalCode'] },
];

export function DoctorProfileEdit() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [resumeUploading, setResumeUploading] = useState(false);

    const { data: user, isLoading: userLoading } = useGetMe();
    const { data: profile, isLoading: profileLoading } = useGetDoctorProfile(user?.id || '');
    const updateProfileMutation = useUpdateDoctorProfile(profile?.id || '');
    const uploadMutation = useUploadFile();

    const { data: specialtiesData } = useGetSpecialties();
    const specialties = specialtiesData?.items ?? [];

    const { selectedSpecialties, addSpecialty, removeSpecialty, setSelectedSpecialties } = useSpecialtySelection();
    const { isOpen: isSpecialtyModalOpen, openModal: openSpecialtyModal, closeModal: closeSpecialtyModal } = useAddSpecialtyModal();

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
    });

    // Pre-populate form with existing profile data
    useEffect(() => {
        if (profile) {
            reset({
                firstName: profile.fullName.split(' ')[0] || '',
                lastName: profile.fullName.split(' ').slice(1).join(' ') || '',
                displayName: profile.displayName || '',
                phone: profile.phone || '',
                dateOfBirth: profile.dob || '',
                gender: profile.gender || undefined,
                bio: profile.summary || '',
                licenseNumber: profile.licenseNumbers?.[0] || '',
                yearsOfExperience: profile.experienceYears || 0,
                qualificationsRaw: profile.qualifications?.join(', ') || '',
                avatarUrl: profile.avatarUrl || '',
                resumeUrl: profile.resumeUrl || '',
                address: profile.address || '',
                city: profile.city || '',
                state: '', // State might not be in profile object based on previous code
                country: profile.country || '',
                postalCode: '', // Postal code might not be in profile object
            });

            if (profile.socialLinks) {
                setSocialLinks(profile.socialLinks);
            }

            if (profile.specialties && specialties.length > 0) {
                const profileSpecialties = specialties.filter(s => profile.specialties?.includes(s.id));
                setSelectedSpecialties(profileSpecialties);
            }
        }
    }, [profile, reset, specialties]);
    const onSubmit = (data: ProfileForm) => {
        if (!profile) return;

        // If user submits (e.g. presses Enter) before final step, just move to next step
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            return;
        }

        const qualifications = data.qualificationsRaw
            ? data.qualificationsRaw
                .split(',')
                .map((q) => q.trim())
                .filter((q) => q.length > 0)
            : undefined;

        const specialtyIds = selectedSpecialties.map((s) => s.id);
        const socialLinksValue = Object.keys(socialLinks).length > 0 ? socialLinks : undefined;

        const profileData: UpdateDoctorProfileDto = {
            fullName: `${data.firstName} ${data.lastName}`,
            displayName: data.displayName || undefined,
            phone: data.phone,
            dob: data.dateOfBirth,
            gender: data.gender,
            summary: data.bio,
            licenseNumbers: data.licenseNumber ? [data.licenseNumber] : undefined,
            experienceYears: data.yearsOfExperience,
            qualifications,
            specialties: specialtyIds.length > 0 ? specialtyIds : undefined,
            address: data.address,
            city: data.city,
            country: data.country,
            avatarUrl: data.avatarUrl || undefined,
            resumeUrl: data.resumeUrl || undefined,
            socialLinks: socialLinksValue,
        };

        updateProfileMutation.mutate(profileData);
    };

    const nextStep = handleSubmit(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }
    });

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (userLoading || profileLoading) {
        return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin" /></div>;
    }

    if (!user || user.role !== UserRole.candidate) {
        return <NotAuthorizedUser userType={user?.role} />;
    }

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-bold">Edit Your Profile</h1>
                        <span className="text-sm text-muted-foreground">
                            Step {currentStep + 1} of {steps.length}
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{steps[currentStep].title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {currentStep === 0 && (
                                <PersonalInfoStep
                                    register={register}
                                    errors={errors}
                                    setValue={setValue}
                                    watch={watch}
                                />
                            )}

                            {currentStep === 1 && (
                                <ProfessionalDetailsStep
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                    specialties={specialties}
                                    selectedSpecialties={selectedSpecialties}
                                    onAddSpecialty={(id: string) => {
                                        const spec = specialties.find((s) => s.id === id);
                                        if (spec) {
                                            addSpecialty(spec);
                                        }
                                    }}
                                    onRemoveSpecialty={removeSpecialty}
                                    socialLinks={socialLinks}
                                    onSocialLinksChange={setSocialLinks}
                                    onAvatarFileSelected={async (file: File | null) => {
                                        if (!file) {
                                            setValue('avatarUrl', '');
                                            return;
                                        }
                                        setAvatarUploading(true);
                                        try {
                                            const url = await uploadMutation.mutateAsync(file);
                                            setValue('avatarUrl', url);
                                        } finally {
                                            setAvatarUploading(false);
                                        }
                                    }}
                                    onResumeFileSelected={async (file: File | null) => {
                                        if (!file) {
                                            setValue('resumeUrl', '');
                                            return;
                                        }
                                        setResumeUploading(true);
                                        try {
                                            const url = await uploadMutation.mutateAsync(file);
                                            setValue('resumeUrl', url);
                                        } finally {
                                            setResumeUploading(false);
                                        }
                                    }}
                                    avatarUploading={avatarUploading}
                                    resumeUploading={resumeUploading}
                                    isModalOpen={isSpecialtyModalOpen}
                                    onOpenModal={openSpecialtyModal}
                                    onCloseModal={closeSpecialtyModal}
                                />
                            )}

                            {currentStep === 2 && (
                                <LocationStep
                                    register={register}
                                    errors={errors}
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={currentStep === 0 ? () => router.back() : prevStep}
                        >
                            {currentStep === 0 ? 'Cancel' : 'Previous'}
                        </Button>

                        {currentStep < steps.length - 1 ? (
                            <Button type="button" onClick={nextStep}>
                                Next
                            </Button>
                        ) : (
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
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
