import { JobType } from '@/types';

export const useJobFormatters = () => {

  const formatSalary = (min?: string | number, max?: string | number) => {
    const minNum = min != null ? Number(min) : null;
    const maxNum = max != null ? Number(max) : null;

    if (minNum === null && maxNum === null) return 'Competitive';
    if (minNum !== null && maxNum !== null) return `${(minNum).toFixed(0)} - ${(maxNum).toFixed(0)}`;
    if (minNum !== null) return `From ${(minNum).toFixed(0)}`;
    return `Up to ${(maxNum!).toFixed(0)}`;
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
