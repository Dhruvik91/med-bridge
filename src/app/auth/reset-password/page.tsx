import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { ResetPasswordContainer } from '@/components/features/auth/container/ResetPasswordContainer';

export const metadata: Metadata = {
  title: 'Reset Password | Med-Bridge',
  description: 'Create a new password for your Med-Bridge account.',
};


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordContainer />
    </Suspense>
  );
}
