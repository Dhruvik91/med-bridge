import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ResetPasswordInvalidToken() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="rounded-full bg-red-100 p-3 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Invalid Link</h3>
                <p className="text-muted-foreground text-sm">
                    This password reset link is invalid or has expired. Please request a new one.
                </p>
            </div>
            <Button asChild className="w-full">
                <Link href="/auth/forgot-password">
                    Request New Link
                </Link>
            </Button>
        </div>
    );
}
