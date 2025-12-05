'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetJob } from '@/hooks/get/useGetJob';
import { useGetDoctorProfile } from '@/hooks/get/useGetDoctorProfile';
import { useGetSavedJobs } from '@/hooks/get/useGetSavedJobs';
import { useGetApplicationsByCandidate } from '@/hooks/get/useGetApplications';
import { useApplyToJob } from '@/hooks/post/useApplyToJob';
import { useSaveJob, useUnsaveJob } from '@/hooks/post/useSaveJob';
import { useUploadFile } from '@/hooks/post/useUploadFile';
import { useToast } from '@/hooks/use-toast';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { JobType, UserRole } from '@/types';
import { JobDetailHeader } from '../components/JobDetailHeader';
import { JobDetailContent } from '../components/JobDetailContent';
import { ApplicationForm } from '../components/ApplicationForm';
import { QuickActionsCard } from '../components/QuickActionsCard';
import { EmployerInfoCard } from '../components/EmployerInfoCard';
import { LocationInfoCard } from '../components/LocationInfoCard';

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ACCEPTED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx'];

// Zod schema for application form
const applicationSchema = z.object({
    coverLetter: z.string().optional(),
    resume: z
        .custom<FileList>()
        .refine((files) => files && files.length > 0, { message: 'Resume is required. Please upload your resume.' })
        .refine((files) => !files || files.length === 0 || files.length === 1, { message: 'Please select only one file' })
        .refine((files) => !files || files.length === 0 || files[0].size > 0, { message: 'File is empty. Please select a valid resume file.' })
        .refine((files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, { message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB` })
        .refine((files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files[0].type), { message: 'Only PDF, DOC, and DOCX files are accepted' })
        .refine((files) => !files || files.length === 0 || ACCEPTED_FILE_EXTENSIONS.some(ext => files[0].name.toLowerCase().endsWith(ext)), { message: 'Invalid file extension. Only .pdf, .doc, and .docx are allowed' })
        .refine((files) => !files || files.length === 0 || files[0].name.length <= 255, { message: 'File name is too long (max 255 characters)' })
        .refine((files) => !files || files.length === 0 || !/[<>:"\/\\|?*\x00-\x1f]/g.test(files[0].name), { message: 'File name contains invalid characters' }),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export const JobDetail = () => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const jobId = params.id as string;

    const [isSaved, setIsSaved] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const form = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
        defaultValues: { coverLetter: '' },
    });

    const { data: user } = useGetMe();
    const { data: profile } = useGetDoctorProfile(user?.id || '');
    const { data: job, isLoading } = useGetJob(jobId);
    const { data: savedJobs = [] } = useGetSavedJobs(user?.id || '');
    const { data: applications = [] } = useGetApplicationsByCandidate(profile?.id || '');

    const applyMutation = useApplyToJob();
    const saveJobMutation = useSaveJob();
    const unsaveJobMutation = useUnsaveJob();
    const uploadMutation = useUploadFile();

    useEffect(() => {
        if (savedJobs && jobId) {
            setIsSaved(savedJobs.some((sj: any) => sj.jobId === jobId));
        }
    }, [savedJobs, jobId]);

    const onSubmitApplication = async (data: ApplicationFormData) => {
        if (!user) {
            router.push(`${FRONTEND_ROUTES.AUTH.LOGIN}?redirect=/jobs/${jobId}`);
            return;
        }

        if (!profile || !profile.fullName || !profile.phone) {
            toast({
                title: 'Complete your profile',
                description: 'Please complete your profile before applying',
                variant: 'destructive',
            });
            router.push(FRONTEND_ROUTES.PROFILE.BASE);
            return;
        }

        let resumeUrl = '';
        if (data.resume && data.resume.length > 0) {
            try {
                resumeUrl = await uploadMutation.mutateAsync(data.resume[0]);
            } catch (error) {
                return;
            }
        }

        applyMutation.mutate({
            jobId,
            candidateId: profile!.id,
            coverLetter: data.coverLetter || '',
            resumeUrl: resumeUrl || undefined,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
            field.onChange(files);
        } else {
            setSelectedFile(null);
            field.onChange(undefined);
        }
    };

    const handleClearResume = (field: any) => {
        setSelectedFile(null);
        field.onChange(undefined);
        const fileInput = document.getElementById('resume') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleSaveJob = () => {
        if (!user) {
            router.push(`${FRONTEND_ROUTES.AUTH.LOGIN}?redirect=/jobs/${jobId}`);
            return;
        }

        if (isSaved) {
            unsaveJobMutation.mutate({ userId: user.id, jobId });
            setIsSaved(false);
        } else {
            saveJobMutation.mutate({ userId: user.id, jobId });
            setIsSaved(true);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: job?.title,
                text: `Check out this job: ${job?.title}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: 'Link copied', description: 'Job link copied to clipboard' });
        }
    };

    const hasApplied = useMemo(() => applications.some(app => app.jobId === jobId), [applications, jobId]);

    const formatSalary = (min?: string | number, max?: string | number, currency?: string) => {
        const minNum = min ? parseFloat(min.toString()) : null;
        const maxNum = max ? parseFloat(max.toString()) : null;
        const currencySymbol = currency === 'INR' ? '₹' : '$';

        if (!minNum && !maxNum) return 'Competitive salary';
        if (minNum && maxNum) return `${currencySymbol}${minNum.toLocaleString()} - ${currencySymbol}${maxNum.toLocaleString()} per year`;
        if (minNum) return `From ${currencySymbol}${minNum.toLocaleString()} per year`;
        return `Up to ${currencySymbol}${maxNum!.toLocaleString()} per year`;
    };

    const getJobTypeLabel = (type: JobType) => {
        return type.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const handleApplyScroll = () => {
        if (!user) {
            router.push(`${FRONTEND_ROUTES.AUTH.LOGIN}?redirect=/jobs/${jobId}`);
        } else {
            document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <Alert variant="destructive" className="max-w-md mx-auto">
                    <AlertDescription>Job not found</AlertDescription>
                </Alert>
                <Button asChild className="mt-6">
                    <Link href={FRONTEND_ROUTES.JOBS.BASE}>Browse Jobs</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <JobDetailHeader
                                title={job.title}
                                organizationName={job.organization?.name || job.employerProfile?.name || 'Healthcare Facility'}
                                location={job.location}
                                jobType={job.jobType}
                                remote={job.remote}
                                postedDate={job.createdAt || job.publishedAt || new Date().toISOString()}
                                viewsCount={typeof job.viewsCount === 'number' ? job.viewsCount : undefined}
                                status={job.status ?? undefined}
                                isSaved={isSaved}
                                onSave={handleSaveJob}
                                onShare={handleShare}
                                isSaving={saveJobMutation.isPending}
                                getJobTypeLabel={getJobTypeLabel}
                            />
                        </CardHeader>

                        <CardContent>
                            <JobDetailContent
                                salary={formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                                applicationDeadline={job.applicationDeadline ?? undefined}
                                maxApplications={typeof job.maxApplications === 'number' ? job.maxApplications : undefined}
                                specialties={job.specialties ?? undefined}
                                description={job.description}
                                requirements={job.requirements}
                                responsibilities={job.responsibilities}
                                perks={job.perks}
                                benefits={job.benefits}
                            />
                        </CardContent>
                    </Card>

                    {user && user.role === UserRole.candidate && (
                        <Card id="apply">
                            <CardHeader>
                                <CardTitle>Apply for this position</CardTitle>
                                <CardDescription>
                                    {hasApplied
                                        ? 'You have already applied for this position'
                                        : 'Submit your application with a cover letter'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ApplicationForm
                                    form={form}
                                    onSubmit={onSubmitApplication}
                                    isSubmitting={applyMutation.isPending}
                                    hasApplied={hasApplied}
                                    appliedDate={applications.find(a => a.jobId === jobId)?.appliedAt}
                                    onFileChange={handleFileChange}
                                    onClearResume={handleClearResume}
                                    selectedFile={selectedFile}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    {(!user || user.role === UserRole.candidate) && (
                        <QuickActionsCard
                            hasApplied={hasApplied}
                            isSaved={isSaved}
                            onApply={handleApplyScroll}
                            onSave={handleSaveJob}
                            isSaving={saveJobMutation.isPending}
                        />
                    )}

                    {(job.organization || job.employerProfile) && (
                        <EmployerInfoCard
                            name={job.organization?.name || job.employerProfile?.name || ''}
                            description={job.organization?.description || job.employerProfile?.description || ""}
                            contactPerson={job.employerProfile?.contactPerson ?? undefined}
                            phone={job.employerProfile?.phone ?? undefined}
                            email={job.employerProfile?.email ?? undefined}
                            address={job.employerProfile?.address ?? undefined}
                            city={job.employerProfile?.city ?? undefined}
                            state={job.employerProfile?.state ?? undefined}
                            country={job.employerProfile?.country ?? undefined}
                            postalCode={job.employerProfile?.postalCode ?? undefined}
                            website={(job.organization?.website ?? job.employerProfile?.website) ?? undefined}
                        />
                    )}

                    {job.location && (
                        <LocationInfoCard
                            city={job.location.city}
                            state={job.location.state}
                            country={job.location.country}
                            latitude={job.location.latitude}
                            longitude={job.location.longitude}
                            remote={job.remote}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
