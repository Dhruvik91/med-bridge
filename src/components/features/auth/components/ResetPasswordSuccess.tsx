import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ResetPasswordSuccess() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Password Reset!</h3>
                <p className="text-muted-foreground text-sm">
                    Your password has been successfully reset. You can now log in with your new password.
                </p>
            </div>
            <Button asChild className="w-full">
                <Link href="/auth/login">
                    Go to Login
                </Link>
            </Button>
        </div>
    );
}
