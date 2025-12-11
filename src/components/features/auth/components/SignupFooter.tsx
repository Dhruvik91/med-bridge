import Link from 'next/link';
import { CardFooter } from '@/components/ui/card';

export function SignupFooter() {
    return (
        <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary font-medium hover:underline">
                    Sign in
                </Link>
            </p>
        </CardFooter>
    );
}
