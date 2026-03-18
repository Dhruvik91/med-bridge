import { Metadata } from 'next';
import { ForgotPasswordContainer } from '@/components/features/auth/container/ForgotPasswordContainer';

export const metadata: Metadata = {
  title: 'Forgot Password | Med-Bridge',
  description: 'Reset your Med-Bridge account password securely.',
};


export default function ForgotPasswordPage() {
  return <ForgotPasswordContainer />;
}
