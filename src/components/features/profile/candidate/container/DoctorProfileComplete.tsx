'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Loader2, CheckCircle2 } from 'lucide-react';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetDoctorProfile } from '@/hooks/get/useGetDoctorProfile';
import { useGetSpecialties } from '@/hooks/get/useGetSpecialties';
import { useGetQualifications } from '@/hooks/get/useGetQualifications';
import { useCreateDoctorProfile } from '@/hooks/post/useCreateDoctorProfile';
import { useUploadFile } from '@/hooks/post/useUploadFile';
import { Gender, CreateDoctorProfileDto } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { useSpecialtySelection } from '@/hooks/useSpecialtySelection';
import { useQualificationSelection } from '@/hooks/useQualificationSelection';
import { useAddSpecialtyModal } from '@/hooks/useAddSpecialtyModal';
import { PersonalInfoStep } from '../components/PersonalInfoStep';
import { ProfessionalDetailsStep } from '../components/ProfessionalDetailsStep';
import { LocationStep } from '../components/LocationStep';

const profileSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    displayName: z.string().optional(),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    dateOfBirth: z.string().optional(),
    gender: z.nativeEnum(Gender).optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    // License is optional to support fresh graduates without licenses yet
    licenseNumber: z.string().optional(),
    yearsOfExperience: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 0)),
    qualificationsRaw: z.string().optional(),
    avatarUrl: z.string().optional(),
    resumeUrl: z.string().optional(),
    // Social links are entered via simple UI, we serialize to JSON before sending
    socialLinksJson: z.string().optional(),
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

export function DoctorProfileComplete() {
    const [currentStep, setCurrentStep] = useState(0);
    const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [resumeUploading, setResumeUploading] = useState(false);
    const router = useRouter();

    const { data: user } = useGetMe();
    const { data: profile, isLoading: profileLoading } = useGetDoctorProfile(user?.id || '');
    const createProfileMutation = useCreateDoctorProfile();
    const uploadMutation = useUploadFile();

    const { data: specialtiesData } = useGetSpecialties();
    const specialties = specialtiesData?.items ?? [];

    const { data: qualificationsData } = useGetQualifications();
    const qualifications = qualificationsData?.items ?? [];

    const { selectedSpecialties, addSpecialty, removeSpecialty } = useSpecialtySelection();
    const { selectedQualifications, addQualification, removeQualification } = useQualificationSelection();
    const { isOpen: isSpecialtyModalOpen, openModal: openSpecialtyModal, closeModal: closeSpecialtyModal } = useAddSpecialtyModal();
    const [isQualModalOpen, setIsQualModalOpen] = useState(false);

    // Redirect to dashboard if profile already exists
    useEffect(() => {
        if (user && !profileLoading && profile) {
            router.push(FRONTEND_ROUTES.DASHBOARD.CANDIDATE);
        }
    }, [user, profile, profileLoading, router]);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
    });

    const onSubmit = (data: ProfileForm) => {
        if (!user) return;

        const specialtyIds = selectedSpecialties.map((s) => s.id);
        const qualificationIds = selectedQualifications.map((q) => q.id);

        // Use social links built from the social links UI state
        const socialLinksValue = Object.keys(socialLinks).length > 0 ? socialLinks : undefined;

        const profileData: CreateDoctorProfileDto = {
            userId: user.id,
            fullName: `${data.firstName} ${data.lastName}`,
            displayName: data.displayName || undefined,
            phone: data.phone,
            dob: data.dateOfBirth,
            gender: data.gender,
            summary: data.bio,
            licenseNumbers: data.licenseNumber ? [data.licenseNumber] : undefined,
            experienceYears: data.yearsOfExperience,
            qualifications: qualificationIds.length > 0 ? qualificationIds : undefined,
            specialties: specialtyIds.length > 0 ? specialtyIds : undefined,
            address: data.address,
            city: data.city,
            country: data.country,
            avatarUrl: data.avatarUrl || undefined,
            resumeUrl: data.resumeUrl || undefined,
            socialLinks: socialLinksValue,
        };

        createProfileMutation.mutate(profileData);
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
                        <span className="text-sm text-muted-foreground">
                            Step {currentStep + 1} of {steps.length}
                        </span>
                    </div>

                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{steps[currentStep].title}</CardTitle>
                            <CardDescription>
                                Please provide accurate information to help employers find you
                            </CardDescription>
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
                                    qualifications={qualifications}
                                    selectedQualifications={selectedQualifications}
                                    onAddQualification={(id: string) => {
                                        const qual = qualifications.find((q) => q.id === id);
                                        if (qual) {
                                            addQualification(qual);
                                        }
                                    }}
                                    onRemoveQualification={removeQualification}
                                    isQualModalOpen={isQualModalOpen}
                                    onOpenQualModal={() => setIsQualModalOpen(true)}
                                    onCloseQualModal={() => setIsQualModalOpen(false)}
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
                            onClick={prevStep}
                            disabled={currentStep === 0}
                        >
                            Previous
                        </Button>

                        {currentStep < steps.length - 1 ? (
                            <Button type="button" onClick={nextStep}>
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={createProfileMutation.isPending}
                            >
                                {createProfileMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Profile...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Complete Profile
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
