import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function SavedJobsUnauthenticated() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Alert>
                <AlertDescription>
                    Please sign in to view your saved jobs.
                </AlertDescription>
            </Alert>
            <Button asChild className="mt-4">
                <Link href={`${FRONTEND_ROUTES.AUTH.LOGIN}`}>Sign In</Link>
            </Button>
        </div>
    );
}
