import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ResetPasswordHeaderProps {
    isSuccess: boolean;
}

export function ResetPasswordHeader({ isSuccess }: ResetPasswordHeaderProps) {
    return (
        <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
                {isSuccess
                    ? 'Your password has been reset successfully'
                    : 'Enter your new password below'}
            </CardDescription>
        </CardHeader>
    );
}
