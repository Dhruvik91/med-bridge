import { JobType } from '@/types';

export const useJobFormatters = () => {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `From $${(min / 1000).toFixed(0)}k`;
    return `Up to $${(max! / 1000).toFixed(0)}k`;
  };

  const getJobTypeLabel = (type: JobType) => {
    return type.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return {
    formatSalary,
    getJobTypeLabel,
    formatDate,
  };
};
