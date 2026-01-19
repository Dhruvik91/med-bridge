import Link from 'next/link';
import { CardFooter } from '@/components/ui/card';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function SignupFooter() {
    return (
        <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
                Already have an account?{' '}
                <Link href={FRONTEND_ROUTES.AUTH.LOGIN} className="text-primary font-medium hover:underline">
                    Sign in
                </Link>
            </p>
        </CardFooter>
    );
}
