'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useGetMe } from '@/hooks/get/useGetMe';
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile';
import { useCreateEmployerProfile } from '@/hooks/post/useCreateEmployerProfile';
import { CreateEmployerProfileDto } from '@/types';
import { FRONTEND_ROUTES } from '@/constants/constants';

const profileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  companyWebsite: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  companyDescription: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  address: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  postalCode: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const steps = [
  { title: 'Company Information', fields: ['companyName', 'contactPersonName', 'phone'] },
  { title: 'Company Details', fields: ['companyWebsite', 'companyDescription'] },
  { title: 'Location', fields: ['address', 'city', 'state', 'country', 'postalCode'] },
];

export default function EmployerProfileCompletePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const router = useRouter();

  const { data: user } = useGetMe();
  const { data: profile } = useGetEmployerProfile(user);
  const createProfileMutation = useCreateEmployerProfile();

  // Redirect to dashboard if profile already exists
  useEffect(() => {
    if (user && profile) {
      router.push(FRONTEND_ROUTES.DASHBOARD.EMPLOYER);
    }
  }, [user, profile, router]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = (data: ProfileForm) => {
    if (!user) return;

    const profileData: CreateEmployerProfileDto = {
      userId: user.id,
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

    createProfileMutation.mutate(profileData);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Complete Company Profile</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>
                Provide accurate company information to attract qualified candidates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Step 0: Company Information */}
              {currentStep === 0 && (
                <>
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
                </>
              )}

              {/* Step 1: Company Details */}
              {currentStep === 1 && (
                <>
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
                </>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      {...register('address')}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        {...register('city')}
                        aria-invalid={!!errors.city}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">{errors.city.message}</p>
                      )}
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
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        {...register('country')}
                        aria-invalid={!!errors.country}
                      />
                      {errors.country && (
                        <p className="text-sm text-destructive">{errors.country.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        {...register('postalCode')}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={createProfileMutation.isPending}
              >
                {createProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Complete Profile
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
