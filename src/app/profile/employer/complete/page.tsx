import { Metadata } from 'next';
import { EmployerProfileComplete } from '@/components/features/profile/employer/container/EmployerProfileComplete';

export const metadata: Metadata = {
  title: 'Complete Your Profile | Employer | Med-Bridge',
  description: 'Complete your organization profile to start posting healthcare jobs.',
};


export default function EmployerProfileCompletePage() {
  return <EmployerProfileComplete />;
}
