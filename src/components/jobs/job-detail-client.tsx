'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Users, 
  Star,
  Briefcase,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Send,
  Calendar,
  Award,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// Mock job data - in real app this would come from Supabase
const mockJobData = {
  id: '1',
  title: 'Emergency Medicine Physician',
  hospital: {
    name: 'City General Hospital',
    logo: '',
    rating: 4.8,
    location: 'New York, NY',
    verified: true,
    description: 'Leading healthcare facility serving the New York metropolitan area for over 50 years.'
  },
  location: 'New York, NY',
  salary: { min: 280000, max: 320000 },
  type: 'Full-time',
  shift: 'Day/Night',
  department: 'Emergency Medicine',
  posted: '2 days ago',
  description: `We are seeking a board-certified Emergency Medicine physician to join our dynamic team at City General Hospital. This is an excellent opportunity to work in a fast-paced, Level 1 trauma center environment while making a significant impact on patient care.

Our Emergency Department sees over 80,000 patients annually and is equipped with state-of-the-art technology and facilities. You'll work alongside a collaborative team of healthcare professionals committed to providing exceptional patient care.`,
  
  requirements: [
    'Board Certification in Emergency Medicine',
    'Valid medical license in New York State',
    'ACLS and BLS certification required',
    'Minimum 3 years of emergency medicine experience',
    'Excellent communication and interpersonal skills',
    'Ability to work in high-stress environments'
  ],
  
  responsibilities: [
    'Provide emergency medical care to patients of all ages',
    'Perform emergency procedures and interventions',
    'Collaborate with multidisciplinary healthcare teams',
    'Maintain accurate medical records and documentation',
    'Participate in quality improvement initiatives',
    'Mentor residents and medical students'
  ],
  
  benefits: [
    'Competitive salary with performance bonuses',
    'Comprehensive health, dental, and vision insurance',
    'Retirement plan with hospital matching',
    'CME allowance and paid time off for conferences',
    'Malpractice insurance coverage',
    'Flexible scheduling options',
    'Professional development opportunities',
    'Relocation assistance available'
  ],
  
  schedule: {
    shifts: '12-hour shifts',
    rotation: 'Day/Night rotation',
    callRequirement: 'Minimal call requirements',
    workLife: 'Excellent work-life balance'
  }
}

interface JobDetailClientProps {
  jobId: string
}

export function JobDetailClient({ jobId }: JobDetailClientProps) {
  const { user, profile } = useAuth()
  const [job] = useState(mockJobData) // In real app, fetch based on jobId
  const [isApplying, setIsApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [hasApplied, setHasApplied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleApply = async () => {
    if (!user || profile?.role !== 'doctor') {
      toast.error('Please sign in as a doctor to apply for jobs')
      return
    }

    setIsApplying(true)
    try {
      // Here you would submit the application to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setHasApplied(true)
      toast.success('Application submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit application')
    } finally {
      setIsApplying(false)
    }
  }

  const handleSaveJob = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? 'Job removed from saved' : 'Job saved successfully!')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Job link copied to clipboard!')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/jobs">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{job.type}</Badge>
                    <Badge variant="outline">{job.shift}</Badge>
                    <Badge variant="outline">{job.department}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground ml-auto">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.posted}
                    </div>
                  </div>
                  
                  <CardTitle className="text-3xl mb-3">{job.title}</CardTitle>
                  
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      {job.hospital.name}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      {job.hospital.rating}
                    </div>
                    {job.hospital.verified && (
                      <div className="flex items-center text-green-600">
                        <Shield className="h-4 w-4 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Key Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start">
                    <Briefcase className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits & Compensation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <Award className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Work Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Shift Details</h4>
                  <p className="text-muted-foreground">{job.schedule.shifts}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Rotation</h4>
                  <p className="text-muted-foreground">{job.schedule.rotation}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Call Requirements</h4>
                  <p className="text-muted-foreground">{job.schedule.callRequirement}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Work-Life Balance</h4>
                  <p className="text-muted-foreground">{job.schedule.workLife}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Salary Range
                <div className="flex items-center text-green-600">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span className="text-2xl font-bold">
                    ${(job.salary.min / 1000).toFixed(0)}K - ${(job.salary.max / 1000).toFixed(0)}K
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasApplied ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have already applied for this position. The hospital will review your application and contact you if you're selected for an interview.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {user && profile?.role === 'doctor' ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" size="lg">
                          Apply Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Apply for {job.title}</DialogTitle>
                          <DialogDescription>
                            Submit your application with a cover letter
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="coverLetter">Cover Letter</Label>
                            <Textarea
                              id="coverLetter"
                              placeholder="Tell the hospital why you're interested in this position..."
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              rows={6}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleApply}
                              disabled={isApplying}
                              className="flex-1"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              {isApplying ? 'Submitting...' : 'Submit Application'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="space-y-2">
                      <Button className="w-full" size="lg" asChild>
                        <Link href="/auth/signup?role=doctor">
                          Sign Up to Apply
                        </Link>
                      </Button>
                      <p className="text-sm text-muted-foreground text-center">
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="text-primary hover:underline">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveJob}
                  className="flex-1"
                >
                  <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Job'}
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hospital Info */}
          <Card>
            <CardHeader>
              <CardTitle>About {job.hospital.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={job.hospital.logo} alt={job.hospital.name} />
                  <AvatarFallback>
                    <Building className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{job.hospital.name}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {job.hospital.rating} rating
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">
                {job.hospital.description}
              </p>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span>{job.hospital.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hospital Type</span>
                  <span>Level 1 Trauma Center</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Beds</span>
                  <span>500+</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                View Hospital Profile
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Contact Recruiter
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="h-4 w-4 mr-2" />
                View Similar Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
