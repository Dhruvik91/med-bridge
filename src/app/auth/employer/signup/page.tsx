import { Metadata } from 'next';
import { SignupContainer } from '@/components/features/auth/container/SignupContainer';

export const metadata: Metadata = {
    title: 'Employer Sign Up',
    description: 'Create a MedBridges account to start your journey. Join as a healthcare professional to find jobs or as an employer to hire top talent.',
};

export default function SignupPage() {
    return <SignupContainer />;
}
