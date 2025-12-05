import { Card, CardContent } from '@/components/ui/card';

interface JobStatsProps {
    total: number;
    published: number;
    draft: number;
    closed: number;
}

export const JobStats = ({ total, published, draft, closed }: JobStatsProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6 pb-6">
                    <div className="text-2xl md:text-3xl font-bold">{total}</div>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Total Jobs</p>
                </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6 pb-6">
                    <div className="text-2xl md:text-3xl font-bold text-green-600">{published}</div>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Published</p>
                </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6 pb-6">
                    <div className="text-2xl md:text-3xl font-bold text-yellow-600">{draft}</div>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Drafts</p>
                </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6 pb-6">
                    <div className="text-2xl md:text-3xl font-bold text-red-600">{closed}</div>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Closed</p>
                </CardContent>
            </Card>
        </div>
    );
};
