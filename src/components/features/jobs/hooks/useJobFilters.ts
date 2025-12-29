import { JobType } from '@/types';

export type JobFilters = {
    searchQuery: string;
    location: string;
    jobType: JobType | 'all';
    salaryMin: number | '';
    salaryMax: number | '';
    experienceMin: number | '';
    experienceMax: number | '';
    specialtyIds: string[];
    postedWithin: string | 'all';
};

export const createInitialJobFilters = (overrides: Partial<JobFilters> = {}): JobFilters => ({
    searchQuery: '',
    location: '',
    jobType: 'all',
    salaryMin: '',
    salaryMax: '',
    experienceMin: '',
    experienceMax: '',
    specialtyIds: [],
    postedWithin: 'all',
    ...overrides,
});

export const hasActiveFilters = (filters: JobFilters): boolean => !!(
    filters.searchQuery ||
    filters.location ||
    filters.jobType !== 'all' ||
    filters.salaryMin !== '' ||
    filters.salaryMax !== '' ||
    filters.experienceMin !== '' ||
    filters.experienceMax !== '' ||
    filters.specialtyIds.length > 0 ||
    filters.postedWithin !== 'all'
);
