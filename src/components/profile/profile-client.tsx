'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Award,
  Upload,
  Save,
  Edit,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Building
} from 'lucide-react'
import { toast } from 'sonner'

const specialties = [
  'Emergency Medicine',
  'Cardiology',
  'Pediatrics',
  'Surgery',
  'Internal Medicine',
  'Radiology',
  'Anesthesiology',
  'Psychiatry',
  'Dermatology',
  'Orthopedics',
  'Neurology',
  'Oncology',
  'Pathology',
  'Family Medicine',
  'Obstetrics & Gynecology'
]

const locations = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA'
]

export function ProfileClient() {
  const { user, profile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Doctor profile state
  const [doctorProfile, setDoctorProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    specialties: [] as string[],
    licenseNumbers: [] as string[],
    experienceYears: '',
    locations: [] as string[],
    availability: '',
    cvUrl: ''
  })

  // Hospital profile state
  const [hospitalProfile, setHospitalProfile] = useState({
    name: '',
    email: '',
    phone: '',
    hospitalName: '',
    address: '',
    website: '',
    description: '',
    contactEmail: '',
    logoUrl: ''
  })

  const [newSpecialty, setNewSpecialty] = useState('')
  const [newLicense, setNewLicense] = useState('')
  const [newLocation, setNewLocation] = useState('')

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'doctor') {
        // Load doctor profile data
        setDoctorProfile({
          name: profile.name || '',
          email: user.email || '',
          phone: '',
          bio: '',
          specialties: [],
          licenseNumbers: [],
          experienceYears: '',
          locations: [],
          availability: '',
          cvUrl: ''
        })
      } else if (profile.role === 'hospital') {
        // Load hospital profile data
        setHospitalProfile({
          name: profile.name || '',
          email: user.email || '',
          phone: '',
          hospitalName: '',
          address: '',
          website: '',
          description: '',
          contactEmail: user.email || '',
          logoUrl: ''
        })
      }
    }
  }, [user, profile])

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Here you would save to Supabase
      // For now, just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const addSpecialty = () => {
    if (newSpecialty && !doctorProfile.specialties.includes(newSpecialty)) {
      setDoctorProfile(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty]
      }))
      setNewSpecialty('')
    }
  }

  const removeSpecialty = (specialty: string) => {
    setDoctorProfile(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }))
  }

  const addLicense = () => {
    if (newLicense && !doctorProfile.licenseNumbers.includes(newLicense)) {
      setDoctorProfile(prev => ({
        ...prev,
        licenseNumbers: [...prev.licenseNumbers, newLicense]
      }))
      setNewLicense('')
    }
  }

  const removeLicense = (license: string) => {
    setDoctorProfile(prev => ({
      ...prev,
      licenseNumbers: prev.licenseNumbers.filter(l => l !== license)
    }))
  }

  const addLocation = () => {
    if (newLocation && !doctorProfile.locations.includes(newLocation)) {
      setDoctorProfile(prev => ({
        ...prev,
        locations: [...prev.locations, newLocation]
      }))
      setNewLocation('')
    }
  }

  const removeLocation = (location: string) => {
    setDoctorProfile(prev => ({
      ...prev,
      locations: prev.locations.filter(l => l !== location)
    }))
  }

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to view your profile.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={undefined} alt={profile.name || user.email || ''} />
            <AvatarFallback className="text-2xl">
              {profile.name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold break-words">
              {profile.name || 'User'}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="secondary">{profile.role}</Badge>
              {profile.isVerified ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pending Verification
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end gap-2 sm:w-auto flex-wrap">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {profile.role === 'doctor' ? (
        <DoctorProfileForm
          profile={doctorProfile}
          setProfile={setDoctorProfile}
          isEditing={isEditing}
          newSpecialty={newSpecialty}
          setNewSpecialty={setNewSpecialty}
          addSpecialty={addSpecialty}
          removeSpecialty={removeSpecialty}
          newLicense={newLicense}
          setNewLicense={setNewLicense}
          addLicense={addLicense}
          removeLicense={removeLicense}
          newLocation={newLocation}
          setNewLocation={setNewLocation}
          addLocation={addLocation}
          removeLocation={removeLocation}
        />
      ) : (
        <HospitalProfileForm
          profile={hospitalProfile}
          setProfile={setHospitalProfile}
          isEditing={isEditing}
        />
      )}
    </div>
  )
}

function DoctorProfileForm({
  profile,
  setProfile,
  isEditing,
  newSpecialty,
  setNewSpecialty,
  addSpecialty,
  removeSpecialty,
  newLicense,
  setNewLicense,
  addLicense,
  removeLicense,
  newLocation,
  setNewLocation,
  addLocation,
  removeLocation
}: any) {
  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <div className="w-full overflow-x-auto">
        <TabsList className="inline-flex min-w-max w-full sm:grid sm:grid-cols-4 sm:min-w-0 gap-1 sm:gap-0">
          <TabsTrigger value="personal" className="whitespace-nowrap text-xs sm:text-sm">Personal Info</TabsTrigger>
          <TabsTrigger value="professional" className="whitespace-nowrap text-xs sm:text-sm">Professional</TabsTrigger>
          <TabsTrigger value="credentials" className="whitespace-nowrap text-xs sm:text-sm">Credentials</TabsTrigger>
          <TabsTrigger value="preferences" className="whitespace-nowrap text-xs sm:text-sm">Preferences</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your basic contact information and bio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile((prev: any) => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile((prev: any) => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your medical background and experience..."
                value={profile.bio}
                onChange={(e) => setProfile((prev: any) => ({ ...prev, bio: e.target.value }))}
                disabled={!isEditing}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="professional">
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>
              Your medical specialties and experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Medical Specialties</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.specialties.map((specialty: string) => (
                  <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                    {specialty}
                    {isEditing && (
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSpecialty(specialty)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Select value={newSpecialty} onValueChange={setNewSpecialty}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addSpecialty} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                value={profile.experienceYears}
                onChange={(e) => setProfile((prev: any) => ({ ...prev, experienceYears: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select
                value={profile.availability}
                onValueChange={(value) => setProfile((prev: any) => ({ ...prev, availability: value }))}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="2-weeks">2 weeks notice</SelectItem>
                  <SelectItem value="1-month">1 month notice</SelectItem>
                  <SelectItem value="3-months">3 months notice</SelectItem>
                  <SelectItem value="not-looking">Not actively looking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="credentials">
        <Card>
          <CardHeader>
            <CardTitle>Medical Credentials</CardTitle>
            <CardDescription>
              Your medical licenses and certifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Medical License Numbers</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.licenseNumbers.map((license: string) => (
                  <Badge key={license} variant="outline" className="flex items-center gap-1">
                    {license}
                    {isEditing && (
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeLicense(license)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter license number"
                    value={newLicense}
                    onChange={(e) => setNewLicense(e.target.value)}
                  />
                  <Button onClick={addLicense} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>CV/Resume</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {profile.cvUrl ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span>CV uploaded</span>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Replace
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your CV or resume
                    </p>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload CV
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle>Job Preferences</CardTitle>
            <CardDescription>
              Your preferred locations and job settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Preferred Locations</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.locations.map((location: string) => (
                  <Badge key={location} variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location}
                    {isEditing && (
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeLocation(location)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Select value={newLocation} onValueChange={setNewLocation}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addLocation} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function HospitalProfileForm({ profile, setProfile, isEditing }: any) {
  return (
    <Tabs defaultValue="basic" className="space-y-6">
      <TabsList className="w-full overflow-x-auto inline-flex min-w-max sm:grid sm:grid-cols-3 sm:min-w-0 gap-1 sm:gap-0">
        <TabsTrigger value="basic" className="whitespace-nowrap text-xs sm:text-sm">Basic Info</TabsTrigger>
        <TabsTrigger value="details" className="whitespace-nowrap text-xs sm:text-sm">Hospital Details</TabsTrigger>
        <TabsTrigger value="branding" className="whitespace-nowrap text-xs sm:text-sm">Branding</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Contact information and basic details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={profile.name}
                  onChange={(e) => setProfile((prev: any) => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile((prev: any) => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={profile.contactEmail}
                  onChange={(e) => setProfile((prev: any) => ({ ...prev, contactEmail: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="details">
        <Card>
          <CardHeader>
            <CardTitle>Hospital Details</CardTitle>
            <CardDescription>
              Information about your healthcare facility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital/Facility Name</Label>
              <Input
                id="hospitalName"
                value={profile.hospitalName}
                onChange={(e) => setProfile((prev: any) => ({ ...prev, hospitalName: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={profile.address}
                onChange={(e) => setProfile((prev: any) => ({ ...prev, address: e.target.value }))}
                disabled={!isEditing}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={profile.website}
                onChange={(e) => setProfile((prev: any) => ({ ...prev, website: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your hospital, culture, and what makes it special..."
                value={profile.description}
                onChange={(e) => setProfile((prev: any) => ({ ...prev, description: e.target.value }))}
                disabled={!isEditing}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="branding">
        <Card>
          <CardHeader>
            <CardTitle>Branding & Media</CardTitle>
            <CardDescription>
              Upload your logo and branding materials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Hospital Logo</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {profile.logoUrl ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>Logo uploaded</span>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Replace
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your hospital logo
                    </p>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
