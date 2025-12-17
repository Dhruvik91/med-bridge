import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ForgotPasswordHeaderProps {
    isSuccess: boolean;
}

export function ForgotPasswordHeader({ isSuccess }: ForgotPasswordHeaderProps) {
    return (
        <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            <CardDescription>
                {isSuccess
                    ? 'Check your email for reset instructions'
                    : "Enter your email and we'll send you a reset link"}
            </CardDescription>
        </CardHeader>
    );
}
