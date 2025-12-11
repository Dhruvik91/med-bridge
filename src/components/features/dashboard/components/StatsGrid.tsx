import { FileText, Clock, TrendingUp, BookmarkPlus } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface StatsGridProps {
    stats: {
        total: number;
        pending: number;
        interview: number;
        savedJobs: number;
    };
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid gap-3 grid-cols-2 md:gap-6 lg:grid-cols-4">
            <StatsCard
                title="Total Applications"
                value={stats.total}
                description="All time"
                icon={FileText}
            />
            <StatsCard
                title="Pending Review"
                value={stats.pending}
                description="Awaiting"
                icon={Clock}
            />
            <StatsCard
                title="Interviews"
                value={stats.interview}
                description="Scheduled"
                icon={TrendingUp}
            />
            <StatsCard
                title="Saved Jobs"
                value={stats.savedJobs}
                description="Bookmarked"
                icon={BookmarkPlus}
            />
        </div>
    );
}
