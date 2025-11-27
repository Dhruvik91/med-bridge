'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { doctorProfileService } from '@/services/doctor-profile.service';
import { useToast } from '@/hooks/use-toast';
import { Gender, UpdateDoctorProfileDto } from '@/types';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  displayName: z.string().optional(),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  dateOfBirth: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  licenseNumber: z.string().optional(),
  yearsOfExperience: z.coerce.number().int().min(0).default(0),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function DoctorProfileEditPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getMe,
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['doctorProfile', user?.id],
    queryFn: () => doctorProfileService.findByUser(user!.id),
    enabled: !!user?.id,
  });

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  // Pre-populate form with existing profile data
  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        displayName: profile.displayName || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dob || '',
        gender: profile.gender || undefined,
        bio: profile.summary || '',
        licenseNumber: profile.licenseNumbers?.[0] || '',
        yearsOfExperience: profile.experienceYears || 0,
        address: profile.address || '',
        city: profile.city || '',
        state: '',
        country: profile.country || '',
        postalCode: '',
      });
    }
  }, [profile, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateDoctorProfileDto) => doctorProfileService.update(profile!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['doctorProfile'] });
      toast({
        title: 'Profile updated successfully',
        description: 'Your changes have been saved',
      });
      router.push(FRONTEND_ROUTES.DASHBOARD.CANDIDATE);
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

    const profileData: UpdateDoctorProfileDto = {
      fullName: data.fullName,
      displayName: data.displayName || undefined,
      phone: data.phone,
      dob: data.dateOfBirth,
      gender: data.gender,
      summary: data.bio,
      licenseNumbers: data.licenseNumber ? [data.licenseNumber] : undefined,
      experienceYears: data.yearsOfExperience,
      address: data.address,
      city: data.city,
      country: data.country,
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

  if (!user || user.role !== 'candidate') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert variant="destructive">
            <AlertDescription>
              You don't have access to this page. Please sign in as a candidate.
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
            <Link href="/profile/doctor/complete">Complete Profile</Link>
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
          <h1 className="text-3xl font-bold">Edit Your Profile</h1>
          <p className="text-muted-foreground mt-1">
            Update your professional information
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
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your basic information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  {...register('fullName')}
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name (Optional)</Label>
                <Input
                  id="displayName"
                  placeholder="How you'd like to be called"
                  {...register('displayName')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
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
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={watch('gender')}
                  onValueChange={(value) => setValue('gender', value as Gender)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Gender.male}>Male</SelectItem>
                    <SelectItem value={Gender.female}>Female</SelectItem>
                    <SelectItem value={Gender.other}>Other</SelectItem>
                    <SelectItem value={Gender.prefer_not_say}>Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>
                Update your medical credentials and experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Medical License Number</Label>
                <Input
                  id="licenseNumber"
                  {...register('licenseNumber')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  min="0"
                  {...register('yearsOfExperience')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  rows={5}
                  placeholder="Tell employers about your experience, specializations, and career goals..."
                  {...register('bio')}
                  aria-invalid={!!errors.bio}
                />
                <p className="text-xs text-muted-foreground">
                  {watch('bio')?.length || 0}/500 characters
                </p>
                {errors.bio && (
                  <p className="text-sm text-destructive">{errors.bio.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>
                Update your location information
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
