import { DoctorProfileEdit } from '@/components/features/profile/candidate/container/DoctorProfileEdit';
import { BackButton } from '@/components/ui/back-button';
import { FRONTEND_ROUTES } from '@/constants/constants';

export default function DoctorProfileEditPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackButton fallbackUrl={FRONTEND_ROUTES.PROFILE.BASE} />
        </div>
        <DoctorProfileEdit />
      </div>
    </div>
  );
}
