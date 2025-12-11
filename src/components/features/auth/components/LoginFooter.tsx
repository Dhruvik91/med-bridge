import Link from 'next/link';
import { CardFooter } from '@/components/ui/card';

export function LoginFooter() {
    return (
        <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-primary font-medium hover:underline">
                    Sign up
                </Link>
            </p>
        </CardFooter>
    );
}
