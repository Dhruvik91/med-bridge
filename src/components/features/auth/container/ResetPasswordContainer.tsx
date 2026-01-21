'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Stethoscope } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authService } from '@/services/auth.service';
import { ResetPasswordHeader } from '../components/ResetPasswordHeader';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { ResetPasswordSuccess } from '../components/ResetPasswordSuccess';
import { ResetPasswordInvalidToken } from '../components/ResetPasswordInvalidToken';

const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordContainer() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token. Please request a new password reset link.');
        }
    }, [token]);

    const onSubmit = async (data: ResetPasswordFormValues) => {
        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await authService.resetPassword({
                token,
                newPassword: data.newPassword,
            });
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (isSuccess) {
            return <ResetPasswordSuccess />;
        }

        if (!token) {
            return <ResetPasswordInvalidToken />;
        }

        return (
            <>
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <ResetPasswordForm
                    form={form}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                />
            </>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-primary/5 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Stethoscope className="h-8 w-8 text-primary" aria-hidden="true" />
                        <span className="text-2xl font-bold">MedBridges</span>
                    </Link>
                </div>

                <Card className="shadow-lg">
                    <ResetPasswordHeader isSuccess={isSuccess} />
                    <CardContent className="space-y-4">
                        {renderContent()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
