import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, ArrowRight } from 'lucide-react';
import { FRONTEND_ROUTES } from '@/constants/constants';

export function SavedJobsEmptyState() {
    return (
        <Card className="text-center py-16">
            <CardContent>
                <BookmarkPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No saved jobs yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Start saving jobs you're interested in to review them later. You can find jobs on the browse page.
                </p>
                <Button asChild size="lg">
                    <Link href={`${FRONTEND_ROUTES.JOBS.BASE}`}>
                        Browse Jobs
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
