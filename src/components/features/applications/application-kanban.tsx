'use client';

import { useState } from 'react';
import { Application, ApplicationStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreVertical, Mail, Phone, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ApplicationKanbanProps {
  applications: Application[];
  onStatusChange?: (applicationId: string, newStatus: ApplicationStatus) => void;
}

const KANBAN_COLUMNS = [
  { status: ApplicationStatus.applied, label: 'New Applications', color: 'border-blue-500' },
  { status: ApplicationStatus.viewed, label: 'Reviewing', color: 'border-purple-500' },
  { status: ApplicationStatus.shortlisted, label: 'Shortlisted', color: 'border-yellow-500' },
  { status: ApplicationStatus.interview, label: 'Interview', color: 'border-orange-500' },
  { status: ApplicationStatus.offer, label: 'Offer', color: 'border-green-500' },
];

export function ApplicationKanban({ applications, onStatusChange }: ApplicationKanbanProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return applications.filter((app) => app.status === status);
  };

  const handleDragStart = (applicationId: string) => {
    setDraggedItem(applicationId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: ApplicationStatus) => {
    if (draggedItem && onStatusChange) {
      onStatusChange(draggedItem, status);
    }
    setDraggedItem(null);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((column) => {
        const columnApplications = getApplicationsByStatus(column.status);

        return (
          <div
            key={column.status}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.status)}
          >
            <Card className={cn('border-t-4', column.color)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">{column.label}</CardTitle>
                  <Badge variant="secondary">{columnApplications.length}</Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-3 p-4 pt-0">
                    {columnApplications.length === 0 ? (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        No applications
                      </div>
                    ) : (
                      columnApplications.map((application) => (
                        <Card
                          key={application.id}
                          draggable
                          onDragStart={() => handleDragStart(application.id)}
                          className="cursor-move hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={application.candidateProfile?.avatarUrl || undefined}
                                  />
                                  <AvatarFallback>
                                    {getInitials(application.candidateProfile?.fullName)}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm truncate">
                                    {application.candidateProfile?.fullName || 'Candidate'}
                                  </h4>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {application.job?.title}
                                  </p>
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <FileText className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Phone className="h-4 w-4 mr-2" />
                                      Schedule Call
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Applied {format(new Date(application.appliedAt), 'MMM dd')}</span>
                                {application.expectedSalary && (
                                  <>
                                    <span>•</span>
                                    <span>${Number(application.expectedSalary).toLocaleString()}</span>
                                  </>
                                )}
                              </div>

                              {application.candidateProfile?.experienceYears !== undefined && (
                                <div className="flex gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {application.candidateProfile.experienceYears}+ years exp
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
