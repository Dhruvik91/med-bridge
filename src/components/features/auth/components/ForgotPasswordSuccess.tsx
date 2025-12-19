import Link from 'next/link';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ForgotPasswordSuccess() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email Sent!</h3>
                <p className="text-muted-foreground text-sm">
                    If an account with that email exists, you will receive a password reset link shortly.
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                    The link will expire in 1 hour.
                </p>
            </div>
            <Button asChild className="w-full">
                <Link href="/auth/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Link>
            </Button>
        </div>
    );
}
