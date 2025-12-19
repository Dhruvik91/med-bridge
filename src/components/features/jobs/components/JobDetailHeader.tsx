import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { MapPin, Building2, Briefcase, Clock, Eye, BookmarkPlus, Bookmark, Share2 } from 'lucide-react';
import { JobType, UserRole } from '@/types';

interface JobDetailHeaderProps {
    title: string;
    organizationName: string;
    location?: {
        city: string;
        state?: string;
        country: string;
    };
    jobType: JobType;
    postedDate: string;
    viewsCount?: number;
    status?: string;
    role?: UserRole,
    isSaved: boolean;
    onSave: () => void;
    onShare: () => void;
    isSaving: boolean;
    getJobTypeLabel: (type: JobType) => string;
}

export const JobDetailHeader = ({
    title,
    organizationName,
    location,
    jobType,
    postedDate,
    viewsCount,
    status,
    role,
    isSaved,
    onSave,
    onShare,
    isSaving,
    getJobTypeLabel,
}: JobDetailHeaderProps) => {
    return (
        <div>
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                    <CardTitle className="text-3xl mb-3">{title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" aria-hidden="true" />
                            {organizationName}
                        </span>
                        {location && (
                            <span className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" aria-hidden="true" />
                                {location.city}, {location.state && `${location.state}, `}{location.country}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    {
                        role === UserRole.candidate && <Button
                            variant="outline"
                            size="icon"
                            onClick={onSave}
                            disabled={isSaving}
                            aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
                        >
                            {isSaved ? (
                                <Bookmark className="h-5 w-5 fill-current" aria-hidden="true" />
                            ) : (
                                <BookmarkPlus className="h-5 w-5" aria-hidden="true" />
                            )}
                        </Button>
                    }
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onShare}
                        aria-label="Share job"
                    >
                        <Share2 className="h-5 w-5" aria-hidden="true" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="text-sm">
                    <Briefcase className="mr-1 h-4 w-4" aria-hidden="true" />
                    {getJobTypeLabel(jobType)}
                </Badge>
                <Badge variant="outline" className="text-sm">
                    <Clock className="mr-1 h-4 w-4" aria-hidden="true" />
                    Posted {new Date(postedDate).toLocaleDateString()}
                </Badge>
                {/* <Badge variant="outline" className="text-sm">
                    <Eye className="mr-1 h-4 w-4" aria-hidden="true" />
                    {viewsCount || 0} views
                </Badge> */}
                {status && (
                    <Badge variant={status === 'published' ? 'default' : 'secondary'} className="text-sm">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                )}
            </div>
        </div>
    );
};
