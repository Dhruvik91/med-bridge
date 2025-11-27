'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, Phone, Mail, MapPin, Calendar, Award, 
  Building2, Globe, Edit, Briefcase, FileText 
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import { doctorProfileService } from '@/services/doctor-profile.service';
import { employerProfileService } from '@/services/employer-profile.service';

export default function ProfilePage() {
  const router = useRouter();
  
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getMe,
  });

  const { data: doctorProfile, isLoading: doctorProfileLoading } = useQuery({
    queryKey: ['doctorProfile', user?.id],
    queryFn: () => doctorProfileService.findByUser(user!.id),
    enabled: !!user?.id && user.role === 'candidate',
  });

  const { data: employerProfile, isLoading: employerProfileLoading } = useQuery({
    queryKey: ['employerProfile', user?.id],
    queryFn: () => employerProfileService.findByUser(user!.id),
    enabled: !!user?.id && user.role === 'employer',
  });

  const isLoading = userLoading || doctorProfileLoading || employerProfileLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  // Doctor/Candidate Profile View
  if (user.role === 'candidate') {
    if (!doctorProfile) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>
              No profile found. Please complete your profile to get started.
            </AlertDescription>
          </Alert>
          <Button 
            className="mt-4"
            onClick={() => router.push('/profile/doctor/complete')}
          >
            Complete Profile
          </Button>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {doctorProfile.displayName || doctorProfile.fullName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Healthcare Professional
            </p>
          </div>
          <Button onClick={() => router.push('/profile/doctor/edit')}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Info Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Email
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{user.email}</div>
            </CardContent>
          </Card>

          {doctorProfile.phone && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Phone
                </CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">{doctorProfile.phone}</div>
              </CardContent>
            </Card>
          )}

          {doctorProfile.experienceYears !== undefined && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Experience
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{doctorProfile.experienceYears}</div>
                <p className="text-xs text-muted-foreground">years</p>
              </CardContent>
            </Card>
          )}

          {(doctorProfile.city || doctorProfile.country) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Location
                </CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {[doctorProfile.city, doctorProfile.country].filter(Boolean).join(', ')}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {doctorProfile.dob && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p className="text-sm">
                    {new Date(doctorProfile.dob).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}
              {doctorProfile.gender && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p className="text-sm capitalize">{doctorProfile.gender.replace('_', ' ')}</p>
                </div>
              )}
              {doctorProfile.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-sm">{doctorProfile.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Credentials</CardTitle>
              <CardDescription>License and certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {doctorProfile.licenseNumbers && doctorProfile.licenseNumbers.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Medical License Numbers</p>
                  <div className="flex flex-wrap gap-2">
                    {doctorProfile.licenseNumbers.map((license, idx) => (
                      <Badge key={idx} variant="outline" className="font-mono">
                        {license}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No license information added</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Professional Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Bio</CardTitle>
            <CardDescription>About your experience and expertise</CardDescription>
          </CardHeader>
          <CardContent>
            {doctorProfile.summary ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{doctorProfile.summary}</p>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No professional bio yet. Add one to showcase your expertise!
                </p>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/profile/doctor/edit')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Add Bio
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Employer Profile View
  if (user.role === 'employer') {
    if (!employerProfile) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>
              No profile found. Please complete your company profile to get started.
            </AlertDescription>
          </Alert>
          <Button 
            className="mt-4"
            onClick={() => router.push('/profile/employer/complete')}
          >
            Complete Profile
          </Button>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {employerProfile.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Healthcare Employer
            </p>
          </div>
          <Button onClick={() => router.push('/profile/employer/edit')}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Info Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Email
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{user.email}</div>
            </CardContent>
          </Card>

          {employerProfile.phone && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Phone
                </CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">{employerProfile.phone}</div>
              </CardContent>
            </Card>
          )}

          {employerProfile.contactPerson && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Contact Person
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">{employerProfile.contactPerson}</div>
              </CardContent>
            </Card>
          )}

          {(employerProfile.city || employerProfile.country) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Location
                </CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {[employerProfile.city, employerProfile.country].filter(Boolean).join(', ')}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Organization details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {employerProfile.website && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website</p>
                  <a 
                    href={employerProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {employerProfile.website}
                  </a>
                </div>
              )}
              {employerProfile.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-sm">{employerProfile.address}</p>
                  {(employerProfile.city || employerProfile.state || employerProfile.country) && (
                    <p className="text-sm">
                      {[
                        employerProfile.city,
                        employerProfile.state,
                        employerProfile.country,
                        employerProfile.postalCode
                      ].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
              <CardDescription>How to reach us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {employerProfile.contactPerson && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Primary Contact</p>
                  <p className="text-sm">{employerProfile.contactPerson}</p>
                </div>
              )}
              {employerProfile.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  <p className="text-sm">{employerProfile.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Company Description */}
        <Card>
          <CardHeader>
            <CardTitle>About the Company</CardTitle>
            <CardDescription>Organization overview and culture</CardDescription>
          </CardHeader>
          <CardContent>
            {employerProfile.description ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{employerProfile.description}</p>
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No company description yet. Add one to attract top healthcare talent!
                </p>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/profile/employer/edit')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Add Description
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert>
        <AlertDescription>
          Unable to load profile. Please try again.
        </AlertDescription>
      </Alert>
    </div>
  );
}
