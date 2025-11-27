'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { employerProfileService } from '@/services/employer-profile.service';
import { useToast } from '@/hooks/use-toast';
import { UpdateEmployerProfileDto } from '@/types';

const profileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  companyWebsite: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  companyDescription: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function EmployerProfileEditPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getMe,
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['employerProfile', user?.id],
    queryFn: () => employerProfileService.findByUser(user!.id),
    enabled: !!user?.id,
  });

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  // Pre-populate form with existing profile data
  useEffect(() => {
    if (profile) {
      reset({
        companyName: profile.name || '',
        contactPersonName: profile.contactPerson || '',
        phone: profile.phone || '',
        companyWebsite: profile.website || '',
        companyDescription: profile.description || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        postalCode: profile.postalCode || '',
      });
    }
  }, [profile, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateEmployerProfileDto) => employerProfileService.update(profile!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
      toast({
        title: 'Profile updated successfully',
        description: 'Your changes have been saved',
      });
      router.push('/dashboard/employer');
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to update profile');
      toast({
        title: 'Update failed',
        description: err.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProfileForm) => {
    if (!profile) return;

    const profileData: UpdateEmployerProfileDto = {
      name: data.companyName,
      contactPerson: data.contactPersonName,
      phone: data.phone,
      website: data.companyWebsite || undefined,
      description: data.companyDescription,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
    };

    updateProfileMutation.mutate(profileData);
  };

  if (userLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Skeleton className="h-12 w-64 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-20" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'employer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert variant="destructive">
            <AlertDescription>
              You don't have access to this page. Please sign in as an employer.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert>
            <AlertDescription>
              No profile found. Please complete your profile first.
            </AlertDescription>
          </Alert>
          <Button asChild className="mt-4">
            <Link href="/profile/employer/complete">Complete Profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/employer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Company Profile</h1>
          <p className="text-muted-foreground mt-1">
            Update your company information
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company/Hospital Name *</Label>
                <Input
                  id="companyName"
                  {...register('companyName')}
                  aria-invalid={!!errors.companyName}
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                <Input
                  id="contactPersonName"
                  {...register('contactPersonName')}
                  aria-invalid={!!errors.contactPersonName}
                />
                {errors.contactPersonName && (
                  <p className="text-sm text-destructive">{errors.contactPersonName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Contact Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Company Website</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  placeholder="https://www.example.com"
                  {...register('companyWebsite')}
                  aria-invalid={!!errors.companyWebsite}
                />
                {errors.companyWebsite && (
                  <p className="text-sm text-destructive">{errors.companyWebsite.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description</Label>
                <Textarea
                  id="companyDescription"
                  rows={6}
                  placeholder="Describe your organization, values, and what makes it a great place to work..."
                  {...register('companyDescription')}
                  aria-invalid={!!errors.companyDescription}
                />
                <p className="text-xs text-muted-foreground">
                  {watch('companyDescription')?.length || 0}/1000 characters
                </p>
                {errors.companyDescription && (
                  <p className="text-sm text-destructive">{errors.companyDescription.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>
                Update your company location information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  {...register('address')}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...register('city')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    {...register('state')}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    {...register('country')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    {...register('postalCode')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
