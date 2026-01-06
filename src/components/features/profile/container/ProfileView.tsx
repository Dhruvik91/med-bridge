'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetDoctorProfile } from '@/hooks/get/useGetDoctorProfile';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useGetSpecialties } from '@/hooks/get/useGetSpecialties';
import { useGetQualifications } from '@/hooks/get/useGetQualifications';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { SignOutConfirmationModal } from '../components/SignOutConfirmationModal';


import { ProfileSkeleton } from '../components/ProfileSkeleton';
import { NoProfileAlert } from '../components/NoProfileAlert';
import { CandidateProfileHeader } from '../candidate/components/CandidateProfileHeader';
import { CandidateInfoCards } from '../candidate/components/CandidateInfoCards';
import { PersonalInfoCard } from '../candidate/components/PersonalInfoCard';
import { ProfessionalCredentialsCard } from '../candidate/components/ProfessionalCredentialsCard';
import { ProfessionalBioCard } from '../candidate/components/ProfessionalBioCard';
import { EmployerProfileHeader } from '../employer/components/EmployerProfileHeader';
import { EmployerInfoCards } from '../employer/components/EmployerInfoCards';
import { CompanyInfoCard } from '../employer/components/CompanyInfoCard';
import { ContactDetailsCard } from '../employer/components/ContactDetailsCard';
import { CompanyDescriptionCard } from '../employer/components/CompanyDescriptionCard';
import { UserRole } from '@/types';

export function ProfileView() {
    const router = useRouter();
    const { signOut } = useAuth();
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

    const { data: user, isLoading: userLoading } = useGetMe();
    const { data: doctorProfile, isLoading: doctorProfileLoading } = useGetDoctorProfile(user?.id || '');
    const { data: employerProfile, isLoading: employerProfileLoading } = useGetEmployerProfile(user);
    const { data: specialtiesData } = useGetSpecialties();
    const { data: qualificationsData } = useGetQualifications();

    const specialties = specialtiesData?.items ?? [];
    const qualifications = qualificationsData?.items ?? [];

    const specialtyNames = doctorProfile?.specialties?.map((id) => {
        const specialty = specialties.find((s) => s.id === id);
        return specialty?.name || id;
    }) || [];

    const qualificationNames = doctorProfile?.qualifications?.map((id) => {
        const qualification = qualifications.find((q) => q.id === id);
        return qualification?.name || id;
    }) || [];

    const isLoading = userLoading || doctorProfileLoading || employerProfileLoading;

    useEffect(() => {
        if (!isLoading && !user) {
            router.push(FRONTEND_ROUTES.AUTH.LOGIN);
        }
    }, [isLoading, user, router]);

    const handleSignOut = async () => {
        try {
            await signOut();
            setIsSignOutModalOpen(false);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (!user) {
        return null;
    }

    // Doctor/Candidate Profile View
    if (user.role === UserRole.candidate) {
        if (!doctorProfile) {
            return (
                <NoProfileAlert
                    message="No profile found. Please complete your profile to get started."
                    buttonText="Complete Profile"
                    onButtonClick={() => router.push(FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE)}
                />
            );
        }

        return (
            <div className="container mx-auto px-4 py-8 space-y-8 pb-24 md:pb-8">
                <CandidateProfileHeader
                    displayName={doctorProfile.displayName || ''}
                    fullName={doctorProfile.fullName}
                    avatarUrl={doctorProfile.avatarUrl ?? undefined}
                    onEditClick={() => router.push(FRONTEND_ROUTES.PROFILE.DOCTOR.EDIT)}
                />

                <CandidateInfoCards
                    email={user.email}
                    phone={doctorProfile.phone ?? undefined}
                    experienceYears={doctorProfile.experienceYears ?? undefined}
                    city={doctorProfile.city ?? undefined}
                    country={doctorProfile.country ?? undefined}
                    socialLinks={doctorProfile.socialLinks ?? undefined}
                    resumeUrl={doctorProfile.resumeUrl ?? undefined}
                    candidateName={doctorProfile.displayName || doctorProfile.fullName}
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <PersonalInfoCard
                        dob={doctorProfile.dob ?? undefined}
                        gender={doctorProfile.gender ?? undefined}
                        address={doctorProfile.address ?? undefined}
                    />

                    <ProfessionalCredentialsCard
                        licenseNumbers={doctorProfile.licenseNumbers}
                        qualifications={qualificationNames}
                        specialties={specialtyNames}
                    />
                </div>

                <ProfessionalBioCard
                    summary={doctorProfile.summary ?? undefined}
                    onEditClick={() => router.push(FRONTEND_ROUTES.PROFILE.DOCTOR.EDIT)}
                />

                <div className="md:hidden pt-4">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => setIsSignOutModalOpen(true)}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>

                <SignOutConfirmationModal
                    isOpen={isSignOutModalOpen}
                    onClose={() => setIsSignOutModalOpen(false)}
                    onConfirm={handleSignOut}
                />
            </div>
        );
    }

    // Employer Profile View
    if (user.role === UserRole.employer) {
        if (!employerProfile) {
            return (
                <NoProfileAlert
                    message="No profile found. Please complete your company profile to get started."
                    buttonText="Complete Profile"
                    onButtonClick={() => router.push(FRONTEND_ROUTES.PROFILE.EMPLOYER.COMPLETE)}
                />
            );
        }

        return (
            <div className="container mx-auto px-4 py-8 space-y-8 pb-24 md:pb-8">
                <EmployerProfileHeader
                    companyName={employerProfile.name}
                    onEditClick={() => router.push(FRONTEND_ROUTES.PROFILE.EMPLOYER.EDIT)}
                />

                <EmployerInfoCards
                    email={user.email}
                    phone={employerProfile.phone ?? undefined}
                    contactPerson={employerProfile.contactPerson ?? undefined}
                    city={employerProfile.city ?? undefined}
                    country={employerProfile.country ?? undefined}
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <CompanyInfoCard
                        website={employerProfile.website ?? undefined}
                        address={employerProfile.address ?? undefined}
                        city={employerProfile.city ?? undefined}
                        state={employerProfile.state ?? undefined}
                        country={employerProfile.country ?? undefined}
                        postalCode={employerProfile.postalCode ?? undefined}
                    />

                    <ContactDetailsCard
                        contactPerson={employerProfile.contactPerson ?? undefined}
                        phone={employerProfile.phone ?? undefined}
                    />
                </div>

                <CompanyDescriptionCard
                    description={employerProfile.description ?? undefined}
                    onEditClick={() => router.push(FRONTEND_ROUTES.PROFILE.EMPLOYER.EDIT)}
                />

                <div className="md:hidden pt-4">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => setIsSignOutModalOpen(true)}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>

                <SignOutConfirmationModal
                    isOpen={isSignOutModalOpen}
                    onClose={() => setIsSignOutModalOpen(false)}
                    onConfirm={handleSignOut}
                />
            </div>
        );
    }

    // Default fallback
    return (
        <div className="container mx-auto px-4 py-8">
            <Alert>
                <AlertDescription>
                    Unable to load profile. Please try again.
                </AlertDescription>
            </Alert>
        </div>
    );
}
