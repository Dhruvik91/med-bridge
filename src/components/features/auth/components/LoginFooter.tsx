import Link from 'next/link';
import { CardFooter } from '@/components/ui/card';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function LoginFooter() {
    return (
        <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href={FRONTEND_ROUTES.AUTH.SIGNUP} className="text-primary font-medium hover:underline">
                    Sign up
                </Link>
            </p>
        </CardFooter>
    );
}
