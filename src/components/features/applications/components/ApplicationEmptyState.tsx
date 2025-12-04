import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ApplicationEmptyStateProps {
    hasApplications: boolean;
    onClearFilters: () => void;
}

export function ApplicationEmptyState({ hasApplications, onClearFilters }: ApplicationEmptyStateProps) {
    return (
        <Card className="text-center py-16">
            <CardContent>
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">
                    {!hasApplications ? 'No applications yet' : 'No matching applications'}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {!hasApplications
                        ? "Applications will appear here once candidates start applying to your jobs."
                        : "Try adjusting your filters to see more applications."}
                </p>
                {!hasApplications ? (
                    <Button asChild size="lg">
                        <Link href="/jobs/create">
                            Post a Job
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                    >
                        Clear Filters
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
