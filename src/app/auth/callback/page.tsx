import { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthCallbackContainer } from '@/components/features/auth/container/AuthCallbackContainer';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Authenticating... | Med-Bridge',
  description: 'Completing your authentication process.',
  robots: { index: false, follow: false },
};

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <AuthCallbackContainer />
    </Suspense>
  );
}
