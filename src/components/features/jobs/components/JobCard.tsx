import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Clock, IndianRupee, DollarSign, Eye, MoreVertical, Edit, Trash2, Users } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Job, UserRole } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface JobCardProps {
    job: Job;
    userRole?: UserRole;
    variant?: 'browse' | 'manage';
    formatSalary: (min?: string | number, max?: string | number) => string;
    getJobTypeLabel: (type: string) => string;
    formatDate: (date: string) => string;
    onDelete?: (jobId: string) => void;
    getStatusColor?: (status: string) => string;
    getStatusIcon?: (status: string) => React.ReactNode;
}

export const JobCard = ({
    job,
    userRole,
    variant = 'browse',
    formatSalary,
    getJobTypeLabel,
    formatDate,
    onDelete,
    getStatusColor,
    getStatusIcon,
}: JobCardProps) => {
    if (variant === 'manage') {
        return (
            <Card className="flex flex-col hover-lift smooth-transition glass-enhanced hover:border-primary/50 group">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <CardTitle className="text-lg md:text-xl font-semibold leading-tight">{job.title}</CardTitle>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm">{getStatusColor && getStatusIcon && (
                                <Badge className={`${getStatusColor(job.status)} text-xs font-medium shrink-0`}>
                                    <span className="flex items-center gap-1">
                                        {getStatusIcon(job.status)}
                                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                    </span>
                                </Badge>
                            )}
                                <Badge variant="secondary" className="font-medium">{getJobTypeLabel(job.jobType)}</Badge>
                                {job.location && (
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span>{job.location.city}, {job.location.country}</span>
                                    </span>
                                )}

                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`${FRONTEND_ROUTES.JOBS.BASE}/${job.id}`} className="cursor-pointer">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Job
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`${FRONTEND_ROUTES.APPLICATIONS.MANAGE}?jobId=${job.id}`} className="cursor-pointer">
                                        <Users className="mr-2 h-4 w-4" />
                                        View Applications
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`${FRONTEND_ROUTES.JOBS.BASE}/${job.id}/edit`} className="cursor-pointer">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Job
                                    </Link>
                                </DropdownMenuItem>
                                {onDelete && (
                                    <DropdownMenuItem
                                        onClick={() => onDelete(job.id)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Job
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 pt-0 flex flex-col justify-between">
                    <div className="space-y-3">
                        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                            {job.description}
                        </CardDescription>

                        {job.specialties && job.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {job.specialties.slice(0, 3).map((specialty) => (
                                    <Badge key={specialty.id} variant="outline" className="text-xs">
                                        {specialty.name}
                                    </Badge>
                                ))}
                                {job.specialties.length > 3 && (
                                    <Badge variant="outline" className="text-xs">+{job.specialties.length - 3} more</Badge>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm mt-4">
                        <span className="flex items-center gap-1.5 text-primary font-semibold">
                            <DollarSign className="h-4 w-4" />
                            {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            {job.viewCount || job.viewsCount || 0} views
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            Posted {new Date(job.postedDate || job.createdAt || job.publishedAt || new Date()).toLocaleDateString()}
                        </span>
                        {job.maxApplications && (
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                Max {job.maxApplications} apps
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Browse variant
    return (
        <Card className="h-full min-h-[320px] flex flex-col hover-lift smooth-transition glass-enhanced hover:border-primary/50 group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                        <Link href={`${FRONTEND_ROUTES.JOBS.BASE}/${job.id}`} className="hover:underline">
                            <CardTitle className="text-lg md:text-xl font-semibold leading-tight">{job.title}</CardTitle>
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                                {job.organization?.name || job.employerProfile?.name || 'Healthcare Facility'}
                            </span>
                            {job.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                                    {job.location.city}, {job.location.country}
                                </span>
                            )}
                        </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0">{getJobTypeLabel(job.jobType)}</Badge>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pt-0 flex flex-col justify-between">
                <div className="space-y-3">
                    <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                        {job.description}
                    </CardDescription>

                    {job.specialties && job.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {job.specialties.slice(0, 3).map((specialty) => (
                                <Badge key={specialty.id} variant="outline" className="text-xs">
                                    {specialty.name}
                                </Badge>
                            ))}
                            {job.specialties.length > 3 && (
                                <Badge variant="outline" className="text-xs">+{job.specialties.length - 3} more</Badge>
                            )}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm">
                        <span className="flex items-center gap-1.5 text-primary font-semibold">
                            <IndianRupee className="h-4 w-4" aria-hidden="true" />
                            {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-4 w-4" aria-hidden="true" />
                            Posted {formatDate(String(job.postedDate || job.createdAt))}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 pt-4">
                    <Button asChild className="flex-1 md:flex-none">
                        <Link href={`${FRONTEND_ROUTES.JOBS.BASE}/${job.id}`}>View Details</Link>
                    </Button>
                    {userRole === UserRole.candidate && (
                        <Button asChild variant="outline" className="flex-1 md:flex-none">
                            <Link href={`${FRONTEND_ROUTES.JOBS.BASE}/${job.id}#apply`}>Quick Apply</Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
