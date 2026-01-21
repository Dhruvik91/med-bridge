import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CandidateProfileHeaderProps {
    displayName: string;
    fullName: string;
    avatarUrl?: string;
    onEditClick: () => void;
}

export function CandidateProfileHeader({
    displayName,
    fullName,
    avatarUrl,
    onEditClick,
}: CandidateProfileHeaderProps) {
    const initials = fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/10">
                    <AvatarImage src={avatarUrl} alt={fullName} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">
                        {displayName || fullName}
                    </h1>
                </div>
            </div>
            <Button onClick={onEditClick}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
            </Button>
        </div>
    );
}
