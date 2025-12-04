import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginFormValues } from '../container/LoginContainer';

interface LoginFormProps {
    form: UseFormReturn<LoginFormValues>;
    onSubmit: (data: LoginFormValues) => Promise<void>;
    isLoading: boolean;
}

export function LoginForm({ form, onSubmit, isLoading }: LoginFormProps) {
    const { register, handleSubmit, formState: { errors } } = form;
    const [showPassword, setShowPassword] = useState(false);

    return (
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

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...register('password')}
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p id="password-error" className="text-sm text-destructive" role="alert">
                        {errors.password.message}
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
                        Signing in...
                    </>
                ) : (
                    'Sign in'
                )}
            </Button>
        </form>
    );
}
