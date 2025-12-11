import { LucideIcon } from 'lucide-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) => {
    return (
        <Card className="text-center py-16">
            <CardHeader>
                <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            {actionLabel && onAction && (
                <CardFooter className="justify-center">
                    <Button onClick={onAction} variant="outline">
                        {actionLabel}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};
