import { Metadata } from 'next';
import { DoctorProfileComplete } from '@/components/features/profile/candidate/container/DoctorProfileComplete';

export const metadata: Metadata = {
  title: 'Complete Your Profile | Candidate | Med-Bridge',
  description: 'Complete your professional profile to start applying for healthcare jobs.',
};


export default function DoctorProfileCompletePage() {
  return <DoctorProfileComplete />;
}
