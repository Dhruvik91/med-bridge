import { Metadata } from 'next';
import { LoginContainer } from '@/components/features/auth/container/LoginContainer';

export const metadata: Metadata = {
  title: 'Login | MedBridges',
  description: 'Log in to your MedBridges account to manage your profile, view job applications, or post new healthcare opportunities.',
};

export default function LoginPage() {
  return <LoginContainer />;
}
