import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DoctorProfile } from '@/types';

interface AdminCandidateNameCellProps {
  candidate: DoctorProfile;
}

export function AdminCandidateNameCell({ candidate }: AdminCandidateNameCellProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={candidate.avatarUrl || undefined} />
        <AvatarFallback>
          {candidate.fullName?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{candidate.fullName}</div>
        <div className="text-sm text-muted-foreground">
          {candidate.user?.email}
        </div>
      </div>
    </div>
  );
}
