import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface ProfileCompletionAlertProps {
    isIncomplete?: boolean;
    message?: string;
    linkHref?: string;
    linkText?: string;
}

export function ProfileCompletionAlert({
    isIncomplete,
    message = 'Complete your profile to increase your chances of getting hired',
    linkHref = '/profile',
    linkText = 'Complete Profile'
}: ProfileCompletionAlertProps) {
    // Support both old API (isIncomplete) and new API (just render if props provided)
    if (isIncomplete === false) return null;

    return (
        <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
                <span>{message}</span>
                <Button asChild variant="link" size="sm">
                    <Link href={linkHref}>
                        {linkText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </AlertDescription>
        </Alert>
    );
}

