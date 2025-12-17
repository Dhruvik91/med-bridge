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
import { LoginHeader } from '../components/LoginHeader';
import { LoginFooter } from '../components/LoginFooter';
import { SocialLogin } from '../components/SocialLogin';
import { LoginForm } from '../components/LoginForm';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginContainer() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, signInWithGoogle } = useAuth();
    const { toast } = useToast();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setError('');
        setIsLoading(true);

        try {
            await signIn(data.email, data.password);

            toast({
                title: 'Login successful',
                description: 'Welcome back to MedBridge',
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Google login failed');
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
                    <LoginHeader />

                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <LoginForm
                            form={form}
                            onSubmit={onSubmit}
                            isLoading={isLoading}
                        />

                        <SocialLogin onGoogleLogin={handleGoogleLogin} />
                    </CardContent>

                    <LoginFooter />
                </Card>
            </div>
        </div>
    );
}
