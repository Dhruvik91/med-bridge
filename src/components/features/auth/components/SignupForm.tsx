'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SignupFormValues } from '../container/SignupContainer';
import { RoleSelector } from './RoleSelector';
import { usePathname } from 'next/navigation';

interface SignupFormProps {
    form: UseFormReturn<SignupFormValues>;
    onSubmit: (data: SignupFormValues) => Promise<void>;
    isLoading: boolean;
}

export function SignupForm({ form, onSubmit, isLoading }: SignupFormProps) {
    const pathName = usePathname()
    const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const selectedRole = watch('role');

    const showRoleSelector = pathName === "/auth/signup"

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <RoleSelector
                selectedRole={selectedRole}
                onRoleChange={(role) => setValue('role', role)}
                showRoleSelection={!showRoleSelector}
            />

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
                <Label htmlFor="password">Password</Label>
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

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...register('confirmPassword')}
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p id="confirm-password-error" className="text-sm text-destructive" role="alert">
                        {errors.confirmPassword.message}
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
                        Creating account...
                    </>
                ) : (
                    'Create account'
                )}
            </Button>

            {/* <p className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-primary">
                    Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-primary">
                    Privacy Policy
                </Link>
            </p> */}
        </form>
    );
}
