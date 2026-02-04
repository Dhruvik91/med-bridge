import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
}

export function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
    return (
        <Card className="glass-enhanced transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 md:px-6 pt-3 md:pt-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                <div className="text-xl md:text-3xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
