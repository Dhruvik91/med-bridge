import { z } from 'zod';
import { JobType, JobStatus } from '@/types';

export const jobSchema = z.object({
    title: z.string().min(1, 'Job title is required').max(100, 'Job title must be less than 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    requirements: z.string().optional(),
    benefits: z.string().optional(),
    salaryMin: z.union([z.string(), z.number()]).optional().transform(val => val === '' ? undefined : String(val)),
    salaryMax: z.union([z.string(), z.number()]).optional().transform(val => val === '' ? undefined : String(val)),
    jobType: z.nativeEnum(JobType, {
        errorMap: () => ({ message: 'Please select a job type' }),
    }),
    status: z.nativeEnum(JobStatus).default(JobStatus.draft),
    closingDate: z.string().optional(),
    organizationId: z.string().optional(),
    locationId: z.string().optional(),
    specialtyIds: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
    if (data.status === JobStatus.published) {
        if (!data.organizationId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Organization is required',
                path: ['organizationId'],
            });
        }
        if (!data.locationId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Location is required',
                path: ['locationId'],
            });
        }
        if (!data.specialtyIds || data.specialtyIds.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'At least one specialty is required',
                path: ['specialtyIds'],
            });
        }
    }
});

export type JobSchemaValues = z.infer<typeof jobSchema>;
