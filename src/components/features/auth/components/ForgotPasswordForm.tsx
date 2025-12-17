import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ForgotPasswordFormValues } from '../container/ForgotPasswordContainer';

interface ForgotPasswordFormProps {
    form: UseFormReturn<ForgotPasswordFormValues>;
    onSubmit: (data: ForgotPasswordFormValues) => Promise<void>;
    isLoading: boolean;
}

export function ForgotPasswordForm({ form, onSubmit, isLoading }: ForgotPasswordFormProps) {
    const { register, handleSubmit, formState: { errors } } = form;

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="doctor@example.com"
                            className="pl-10"
                            {...register('email')}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                    </div>
                    {errors.email && (
                        <p id="email-error" className="text-sm text-destructive" role="alert">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    aria-busy={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                            Sending...
                        </>
                    ) : (
                        'Send Reset Link'
                    )}
                </Button>
            </form>

            <div className="text-center">
                <Link
                    href="/auth/login"
                    className="text-sm text-primary hover:underline inline-flex items-center"
                >
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Back to Login
                </Link>
            </div>
        </>
    );
}
