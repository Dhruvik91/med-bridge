import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '@/types';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: 'bg-blue-100 text-blue-800',
  viewed: 'bg-purple-100 text-purple-800',
  shortlisted: 'bg-yellow-100 text-yellow-800',
  interview: 'bg-orange-100 text-orange-800',
  offer: 'bg-green-100 text-green-800',
  hired: 'bg-teal-100 text-teal-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
};

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  return (
    <Badge className={STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'}>
      {status}
    </Badge>
  );
}
