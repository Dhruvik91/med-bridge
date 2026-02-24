import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '@/types';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: 'bg-primary/10 text-foreground',
  viewed: 'bg-secondary text-secondary-foreground',
  shortlisted: 'bg-accent text-accent-foreground',
  interview: 'bg-muted text-muted-foreground',
  offer: 'bg-primary/15 text-foreground',
  hired: 'bg-primary text-primary-foreground',
  rejected: 'bg-destructive/10 text-destructive',
  withdrawn: 'bg-muted text-muted-foreground',
};

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  return (
    <Badge className={STATUS_COLORS[status] || 'bg-muted text-muted-foreground'}>
      {status}
    </Badge>
  );
}
