'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Briefcase,
  BookmarkPlus,
  Bookmark,
  Share2,
  Eye,
  ArrowLeft,
  Send
} from 'lucide-react';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetJob } from '@/hooks/get/useGetJob';
import { useGetDoctorProfile } from '@/hooks/get/useGetDoctorProfile';
import { useGetSavedJobs } from '@/hooks/get/useGetSavedJobs';
import { useGetApplicationsByCandidate } from '@/hooks/get/useGetApplications';
import { useApplyToJob } from '@/hooks/post/useApplyToJob';
import { useSaveJob, useUnsaveJob } from '@/hooks/post/useSaveJob';
import { useToast } from '@/hooks/use-toast';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { JobType } from '@/types';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const jobId = params.id as string;
  
  const [coverLetter, setCoverLetter] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Fetch data using hooks
  const { data: user } = useGetMe();
  const { data: profile } = useGetDoctorProfile(user?.id || '');
  const { data: job, isLoading } = useGetJob(jobId);
  const { data: savedJobs = [] } = useGetSavedJobs(user?.id || '');
  const { data: applications = [] } = useGetApplicationsByCandidate(profile?.id || '');

  // Mutation hooks
  const applyMutation = useApplyToJob();
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();

  useEffect(() => {
    if (savedJobs && jobId) {
      setIsSaved(savedJobs.some((sj: any) => sj.jobId === jobId));
    }
  }, [savedJobs, jobId]);

  const handleApply = () => {
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

    applyMutation.mutate({
      jobId,
      candidateId: profile!.id,
      coverLetter,
    });
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
      toast({
        title: 'Link copied',
        description: 'Job link copied to clipboard',
      });
    }
  };

  const hasApplied = applications.some(app => app.jobId === jobId);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Competitive salary';
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k per year`;
    if (min) return `From $${(min / 1000).toFixed(0)}k per year`;
    return `Up to $${(max! / 1000).toFixed(0)}k per year`;
  };

  const getJobTypeLabel = (type: JobType) => {
    return type.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
          <Link href="/jobs">Browse Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/jobs">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Back to Jobs
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-3">{job.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" aria-hidden="true" />
                      {job.organization?.name || job.employerProfile?.name || 'Healthcare Facility'}
                    </span>
                    {job.location && (
                      <span className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" aria-hidden="true" />
                        {job.location.city}, {job.location.state && `${job.location.state}, `}{job.location.country}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSaveJob}
                    disabled={saveJobMutation.isPending}
                    aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
                  >
                    {isSaved ? (
                      <Bookmark className="h-5 w-5 fill-current" aria-hidden="true" />
                    ) : (
                      <BookmarkPlus className="h-5 w-5" aria-hidden="true" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    aria-label="Share job"
                  >
                    <Share2 className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="text-sm">
                  <Briefcase className="mr-1 h-4 w-4" aria-hidden="true" />
                  {getJobTypeLabel(job.jobType)}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Clock className="mr-1 h-4 w-4" aria-hidden="true" />
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Eye className="mr-1 h-4 w-4" aria-hidden="true" />
                  {job.viewCount} views
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Salary */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
                  Salary
                </h3>
                <p className="text-lg">{formatSalary(job.salaryMin, job.salaryMax)}</p>
              </div>

              <Separator />

              {/* Specialties */}
              {job.specialties && job.specialties.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.specialties.map((specialty) => (
                        <Badge key={specialty.id} variant="secondary">
                          {specialty.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-3">Job Description</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Requirements</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{job.requirements}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Benefits */}
              {job.benefits && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Benefits</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{job.benefits}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Apply Section */}
          {user && user.role === 'candidate' && (
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
                {hasApplied ? (
                  <Alert>
                    <AlertDescription>
                      You submitted an application on{' '}
                      {new Date(applications.find(a => a.jobId === jobId)!.appliedAt).toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                      <Textarea
                        id="coverLetter"
                        rows={6}
                        placeholder="Tell the employer why you're a great fit for this position..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleApply}
                      disabled={applyMutation.isPending}
                      className="w-full"
                    >
                      {applyMutation.isPending ? (
                        'Submitting...'
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Apply Card */}
          {(!user || user.role === 'candidate') && !hasApplied && (
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Quick Apply</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => {
                    if (!user) {
                      router.push(`${FRONTEND_ROUTES.AUTH.LOGIN}?redirect=/jobs/${jobId}`);
                    } else {
                      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full"
                  size="lg"
                >
                  Apply Now
                </Button>
                <Button
                  onClick={handleSaveJob}
                  variant="outline"
                  className="w-full"
                  disabled={saveJobMutation.isPending}
                >
                  {isSaved ? 'Saved' : 'Save for Later'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Company Info */}
          {(job.organization || job.employerProfile) && (
            <Card>
              <CardHeader>
                <CardTitle>About the Employer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">
                    {job.organization?.name || job.employerProfile?.name}
                  </h4>
                  {(job.organization?.description || job.employerProfile?.description) && (
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {job.organization?.description || job.employerProfile?.description}
                    </p>
                  )}
                </div>
                {(job.organization?.website || job.employerProfile?.website) && (
                  <Button asChild variant="outline" className="w-full" size="sm">
                    <a
                      href={(job.organization?.website || job.employerProfile?.website) || ''}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Location Info */}
          {job.location && (
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{job.location.name}</p>
                  {job.location.address && <p>{job.location.address}</p>}
                  <p>
                    {job.location.city}
                    {job.location.state && `, ${job.location.state}`}
                    {job.location.postalCode && ` ${job.location.postalCode}`}
                  </p>
                  <p>{job.location.country}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
