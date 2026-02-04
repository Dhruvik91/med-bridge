'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BarChart3 } from 'lucide-react';
import { JobStats } from './JobStats';

interface MobileJobStatsDrawerProps {
    stats: {
        total: number;
        published: number;
        draft: number;
        closed: number;
    };
}

export const MobileJobStatsDrawer = ({ stats }: MobileJobStatsDrawerProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                    <BarChart3 className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-auto max-h-[80vh] overflow-y-auto glass-enhanced">
                <SheetHeader className="mb-6">
                    <SheetTitle>Job Statistics</SheetTitle>
                </SheetHeader>

                <JobStats
                    total={stats.total}
                    published={stats.published}
                    draft={stats.draft}
                    closed={stats.closed}
                />

                <div className="mt-4">
                    <Button className="w-full" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};
