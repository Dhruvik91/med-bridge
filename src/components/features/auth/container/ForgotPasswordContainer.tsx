'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authService } from '@/services/auth.service';
import { ForgotPasswordHeader } from '../components/ForgotPasswordHeader';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { ForgotPasswordSuccess } from '../components/ForgotPasswordSuccess';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordContainer() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setError('');
        setIsLoading(true);

        try {
            await authService.forgotPassword({ email: data.email });
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (isSuccess) {
            return <ForgotPasswordSuccess />;
        }

        return (
            <>
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <ForgotPasswordForm
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
                        <span className="text-2xl font-bold">MedBridge</span>
                    </Link>
                </div>

                <Card className="shadow-lg">
                    <ForgotPasswordHeader isSuccess={isSuccess} />
                    <CardContent className="space-y-4">
                        {renderContent()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
