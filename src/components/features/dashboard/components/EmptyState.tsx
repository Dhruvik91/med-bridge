import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LucideIcon, Plus } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
    return (
        <div className="text-center py-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border-2 border-dashed border-muted">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {description}
            </p>
            <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                <Link href={actionHref}>
                    <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
                    {actionLabel}
                </Link>
            </Button>
        </div>
    );
}
