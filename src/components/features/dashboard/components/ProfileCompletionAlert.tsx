import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface ProfileCompletionAlertProps {
    isIncomplete: boolean;
}

export function ProfileCompletionAlert({ isIncomplete }: ProfileCompletionAlertProps) {
    if (!isIncomplete) return null;

    return (
        <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
                <span>Complete your profile to increase your chances of getting hired</span>
                <Button asChild variant="link" size="sm">
                    <Link href="/profile">
                        Complete Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </AlertDescription>
        </Alert>
    );
}
