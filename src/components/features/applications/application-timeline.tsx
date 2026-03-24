'use client';

import { Application, ApplicationStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Eye, UserCheck, Briefcase, XCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ApplicationTimelineProps {
  applications: Application[];
}

const STATUS_CONFIG = {
  [ApplicationStatus.applied]: {
    label: 'Applied',
    icon: FileText,
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  [ApplicationStatus.viewed]: {
    label: 'Viewed',
    icon: Eye,
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
  [ApplicationStatus.shortlisted]: {
    label: 'Shortlisted',
    icon: UserCheck,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
  },
  [ApplicationStatus.interview]: {
    label: 'Interview',
    icon: Briefcase,
    color: 'bg-orange-500',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
  [ApplicationStatus.offer]: {
    label: 'Offer',
    icon: CheckCircle2,
    color: 'bg-green-500',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  [ApplicationStatus.hired]: {
    label: 'Hired',
    icon: CheckCircle2,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
  },
  [ApplicationStatus.rejected]: {
    label: 'Rejected',
    icon: XCircle,
    color: 'bg-red-500',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950',
  },
  [ApplicationStatus.withdrawn]: {
    label: 'Withdrawn',
    icon: XCircle,
    color: 'bg-gray-500',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950',
  },
};

export function ApplicationTimeline({ applications }: ApplicationTimelineProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
        <p className="text-muted-foreground">
          Start applying to jobs to track your application progress here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application, index) => {
        const config = STATUS_CONFIG[application.status];
        const Icon = config.icon;

        return (
          <Card key={application.id} className="overflow-hidden">
            <CardHeader className={cn('pb-3', config.bgColor)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">
                    {application.job?.title || 'Job Title'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {application.job?.organization?.name || 'Company'}
                  </p>
                </div>
                <Badge variant="secondary" className={cn('gap-1', config.textColor)}>
                  <Icon className="h-3 w-3" />
                  {config.label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Applied on</span>
                  <span className="font-medium">
                    {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                  </span>
                </div>

                {application.updatedAt !== application.appliedAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last updated</span>
                    <span className="font-medium">
                      {format(new Date(application.updatedAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}

                {application.expectedSalary && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expected salary</span>
                    <span className="font-medium">
                      ${Number(application.expectedSalary).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <div className="flex gap-2">
                    {[
                      ApplicationStatus.applied,
                      ApplicationStatus.viewed,
                      ApplicationStatus.shortlisted,
                      ApplicationStatus.interview,
                      ApplicationStatus.offer,
                    ].map((status, idx) => {
                      const isActive =
                        Object.values(ApplicationStatus).indexOf(application.status) >= idx;
                      const statusConfig = STATUS_CONFIG[status];

                      return (
                        <div
                          key={status}
                          className={cn(
                            'flex-1 h-2 rounded-full transition-all',
                            isActive ? statusConfig.color : 'bg-muted'
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
