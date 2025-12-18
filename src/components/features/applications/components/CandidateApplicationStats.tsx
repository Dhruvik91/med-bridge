import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CandidateApplicationStatsProps {
    stats: {
        total: number;
        applied: number;
        viewed: number;
        interview: number;
        hired: number;
        rejected: number;
    };
    className?: string;
}

export function CandidateApplicationStats({ stats, className }: CandidateApplicationStatsProps) {
    return (
        <div className={cn("grid gap-4 grid-cols-2 md:grid-cols-6", className)}>
            <Card>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{stats.applied}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Viewed</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{stats.viewed}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Interview</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">{stats.interview}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Hired</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold text-green-600">{stats.hired}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                </CardContent>
            </Card>
        </div>
    );
}
