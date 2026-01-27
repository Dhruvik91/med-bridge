'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BarChart3 } from 'lucide-react';
import { ApplicationStats } from './ApplicationStats';

interface MobileApplicationStatsDrawerProps {
    stats: {
        total: number;
        applied: number;
        viewed: number;
        shortlisted: number;
        interview: number;
        offer: number;
        hired: number;
        rejected: number;
    };
}

export const MobileApplicationStatsDrawer = ({ stats }: MobileApplicationStatsDrawerProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                    <BarChart3 className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-auto max-h-[80vh] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>Application Statistics</SheetTitle>
                </SheetHeader>

                <ApplicationStats stats={stats} />

                <div className="mt-4">
                    <Button className="w-full" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};
