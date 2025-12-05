import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface CandidateProfileHeaderProps {
    displayName: string;
    fullName: string;
    onEditClick: () => void;
}

export function CandidateProfileHeader({
    displayName,
    fullName,
    onEditClick,
}: CandidateProfileHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                    {displayName || fullName}
                </h1>
                <p className="text-muted-foreground mt-1">
                    Healthcare Professional
                </p>
            </div>
            <Button onClick={onEditClick}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
            </Button>
        </div>
    );
}
