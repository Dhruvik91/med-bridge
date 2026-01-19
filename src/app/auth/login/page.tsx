import { Metadata } from 'next';
import { LoginContainer } from '@/components/features/auth/container/LoginContainer';

export const metadata: Metadata = {
  title: 'Login | MedBridge',
  description: 'Log in to your MedBridge account to manage your profile, view job applications, or post new healthcare opportunities.',
};

export default function LoginPage() {
  return <LoginContainer />;
}
