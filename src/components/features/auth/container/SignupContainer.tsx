'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { UserRole } from '@/types';
import { SignupHeader } from '../components/SignupHeader';
import { SignupFooter } from '../components/SignupFooter';
import { SocialLogin } from '../components/SocialLogin';
import { SignupForm } from '../components/SignupForm';

const signupSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum([UserRole.candidate, UserRole.employer]),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupContainer() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signUp, signInWithGoogle } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: UserRole.candidate,
        },
    });

    const onSubmit = async (data: SignupFormValues) => {
        setError('');
        setIsLoading(true);

        try {
            await signUp(data.email, data.password, data.role);

            toast({
                title: 'Account created successfully',
                description: 'Welcome to MedBridge! Please complete your profile.',
            });

            // Redirect to profile completion based on role
            if (data.role === UserRole.candidate) {
                router.push(FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE);
            } else {
                router.push(FRONTEND_ROUTES.PROFILE.EMPLOYER.COMPLETE);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create account. Please try again.');
            toast({
                title: 'Signup failed',
                description: err.message || 'Failed to create account',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Failed to sign up with Google. Please try again.');
            toast({
                title: 'Google signup failed',
                description: err.message || 'Failed to sign up with Google',
                variant: 'destructive',
            });
        }
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
                    <SignupHeader />

                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <SignupForm
                            form={form}
                            onSubmit={onSubmit}
                            isLoading={isLoading}
                        />

                        <SocialLogin onGoogleLogin={handleGoogleSignup} />
                    </CardContent>

                    <SignupFooter />
                </Card>
            </div>
        </div>
    );
}
