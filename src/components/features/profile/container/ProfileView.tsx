'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetDoctorProfile } from '@/hooks/get/useGetDoctorProfile';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';

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

export function ProfileView() {
    const router = useRouter();

    const { data: user, isLoading: userLoading } = useGetMe();
    const { data: doctorProfile, isLoading: doctorProfileLoading } = useGetDoctorProfile(user?.id || '');
    const { data: employerProfile, isLoading: employerProfileLoading } = useGetEmployerProfile(user);

    const isLoading = userLoading || doctorProfileLoading || employerProfileLoading;

    useEffect(() => {
        if (!isLoading && !user) {
            router.push(FRONTEND_ROUTES.AUTH.LOGIN);
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (!user) {
        return null;
    }

    // Doctor/Candidate Profile View
    if (user.role === 'candidate') {
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
            <div className="container mx-auto px-4 py-8 space-y-8">
                <CandidateProfileHeader
                    displayName={doctorProfile.displayName || ''}
                    fullName={doctorProfile.fullName}
                    onEditClick={() => router.push(FRONTEND_ROUTES.PROFILE.DOCTOR.EDIT)}
                />

                <CandidateInfoCards
                    email={user.email}
                    phone={doctorProfile.phone ?? undefined}
                    experienceYears={doctorProfile.experienceYears ?? undefined}
                    city={doctorProfile.city ?? undefined}
                    country={doctorProfile.country ?? undefined}
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <PersonalInfoCard
                        dob={doctorProfile.dob ?? undefined}
                        gender={doctorProfile.gender ?? undefined}
                        address={doctorProfile.address ?? undefined}
                    />

                    <ProfessionalCredentialsCard
                        licenseNumbers={doctorProfile.licenseNumbers}
                    />
                </div>

                <ProfessionalBioCard
                    summary={doctorProfile.summary ?? undefined}
                    onEditClick={() => router.push(FRONTEND_ROUTES.PROFILE.DOCTOR.EDIT)}
                />
            </div>
        );
    }

    // Employer Profile View
    if (user.role === 'employer') {
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
            <div className="container mx-auto px-4 py-8 space-y-8">
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
