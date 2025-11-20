'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  MapPin, 
  Filter, 
  Clock, 
  Star, 
  Briefcase,
  DollarSign,
  Building,
  Users
} from 'lucide-react'

// Mock data for demonstration
const mockJobs = [
  {
    id: '1',
    title: 'Emergency Medicine Physician',
    hospital: 'City General Hospital',
    location: 'New York, NY',
    salary: '$280K - $320K',
    type: 'Full-time',
    shift: 'Day/Night',
    department: 'Emergency Medicine',
    posted: '2 days ago',
    rating: 4.8,
    description: 'Seeking board-certified Emergency Medicine physician for busy Level 1 trauma center.',
    requirements: ['Board Certified in Emergency Medicine', 'ACLS/BLS Certified', '3+ years experience'],
    benefits: ['Health Insurance', 'Retirement Plan', 'CME Allowance', 'Malpractice Insurance']
  },
  {
    id: '2',
    title: 'Cardiologist - Interventional',
    hospital: 'Heart & Vascular Institute',
    location: 'Los Angeles, CA',
    salary: '$450K - $550K',
    type: 'Full-time',
    shift: 'Day',
    department: 'Cardiology',
    posted: '1 week ago',
    rating: 4.9,
    description: 'Join our world-class cardiology team performing cutting-edge interventional procedures.',
    requirements: ['Board Certified in Cardiology', 'Fellowship in Interventional Cardiology', '5+ years experience'],
    benefits: ['Competitive Salary', 'Research Opportunities', 'CME Support', 'Relocation Assistance']
  },
  {
    id: '3',
    title: 'Pediatric Surgeon',
    hospital: 'Children\'s Medical Center',
    location: 'Chicago, IL',
    salary: '$400K - $500K',
    type: 'Full-time',
    shift: 'Day/Call',
    department: 'Pediatric Surgery',
    posted: '3 days ago',
    rating: 4.7,
    description: 'Opportunity to join premier pediatric surgery program at leading children\'s hospital.',
    requirements: ['Board Certified in Pediatric Surgery', 'Fellowship Training', 'Excellent surgical skills'],
    benefits: ['Academic Affiliation', 'Research Support', 'Comprehensive Benefits', 'Work-Life Balance']
  }
]

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
  'Orthopedics'
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

export function JobsListingClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [selectedJobType, setSelectedJobType] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesLocation = !selectedLocation || selectedLocation === 'all' || job.location === selectedLocation
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === 'all' || job.department === selectedSpecialty
    const matchesJobType = !selectedJobType || selectedJobType === 'all' || job.type === selectedJobType

    return matchesSearch && matchesLocation && matchesSpecialty && matchesJobType
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Medical Job Opportunities</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Discover your next career opportunity in healthcare
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs, hospitals, specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative min-w-[200px]">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Specialty</label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      {specialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Job Type</label>
                  <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Locum">Locum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedLocation('all')
                      setSelectedSpecialty('all')
                      setSelectedJobType('all')
                      setSearchQuery('')
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredJobs.length} of {mockJobs.length} jobs
        </p>
      </div>

      {/* Job Listings */}
      <div className="grid gap-4 md:gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="space-y-3">
                {/* Mobile-first layout for badges and posted time */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                    <Badge variant="outline" className="text-xs">{job.shift}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.posted}
                  </div>
                </div>
                
                {/* Job title */}
                <CardTitle className="text-lg sm:text-xl leading-tight">{job.title}</CardTitle>
                
                {/* Hospital and location info - stacked on mobile */}
                <div className="space-y-2 sm:space-y-1">
                  <div className="flex items-center text-sm sm:text-base">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{job.hospital}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm sm:text-base text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="font-medium">{job.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
                  {job.description}
                </p>
                
                {/* Requirements badges - responsive layout */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Badge variant="outline" className="text-xs">{job.department}</Badge>
                  {job.requirements.slice(0, isMobile ? 1 : 2).map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs truncate max-w-[120px] sm:max-w-none">
                      {req}
                    </Badge>
                  ))}
                  {job.requirements.length > (isMobile ? 1 : 2) && (
                    <Badge variant="outline" className="text-xs">
                      +{job.requirements.length - (isMobile ? 1 : 2)} more
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Salary and benefits - mobile optimized */}
                <div className="space-y-3 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    {/* Salary and benefits info */}
                    <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-semibold text-base sm:text-lg">{job.salary}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{job.benefits.length} benefits</span>
                      </div>
                    </div>
                    
                    {/* Action buttons - full width on mobile */}
                    <div className="flex gap-2 sm:gap-2">
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                        Save
                      </Button>
                      <Button size="sm" className="flex-1 sm:flex-none">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredJobs.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      )}

      {/* No Results */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setSelectedLocation('all')
              setSelectedSpecialty('all')
              setSelectedJobType('all')
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
