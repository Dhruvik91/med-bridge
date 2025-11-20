import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MedBridge - Healthcare Job Marketplace for Doctors and Hospitals',
  description: 'Connect qualified doctors with healthcare opportunities. Professional medical job marketplace with verified credentials and trusted employers.',
  alternates: {
    canonical: '/'
  }
}

import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Stethoscope, 
  Users, 
  Briefcase, 
  Shield, 
  Search,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="relative min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Connecting Healthcare
              <span className="text-primary block">Professionals</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The trusted marketplace where qualified doctors find their next opportunity 
              and hospitals discover exceptional medical talent.
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search jobs, specialties, hospitals..." 
                  className="pl-10 h-12"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Location" 
                  className="pl-10 h-12"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                Search Jobs
              </Button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup?role=doctor">
                <Button size="lg" className="w-full sm:w-auto">
                  <Stethoscope className="mr-2 h-5 w-5" />
                  I'm a Doctor
                </Button>
              </Link>
              <Link href="/auth/signup?role=hospital">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Briefcase className="mr-2 h-5 w-5" />
                  I'm a Hospital
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-background/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
                <div className="text-muted-foreground">Active Doctors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">1,200+</div>
                <div className="text-muted-foreground">Healthcare Facilities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">15,000+</div>
                <div className="text-muted-foreground">Jobs Posted</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose MedBridge?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're built specifically for healthcare professionals with features 
                that matter most to doctors and hospitals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Verified Credentials</CardTitle>
                  <CardDescription>
                    All medical licenses and certifications are verified through 
                    our rigorous authentication process.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Trusted Network</CardTitle>
                  <CardDescription>
                    Connect with reputable healthcare facilities and qualified 
                    medical professionals across the country.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Briefcase className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Smart Matching</CardTitle>
                  <CardDescription>
                    Our AI-powered system matches doctors with opportunities 
                    based on specialties, experience, and preferences.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="bg-secondary/20 py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Opportunities</h2>
                <p className="text-muted-foreground">Latest job openings from top healthcare facilities</p>
              </div>
              <Link href="/jobs">
                <Button variant="outline">
                  View All Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Job Cards */}
              {[1, 2, 3].map((i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">Full-time</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        2 days ago
                      </div>
                    </div>
                    <CardTitle className="text-lg">Emergency Medicine Physician</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      City General Hospital, New York
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-2xl font-bold text-primary">$280K - $320K</div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm">4.8</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">Emergency Medicine</Badge>
                      <Badge variant="outline">Board Certified</Badge>
                    </div>
                    <Button className="w-full">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How MedBridge Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Simple steps to connect healthcare professionals with opportunities
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16">
              {/* For Doctors */}
              <div>
                <h3 className="text-2xl font-bold mb-8 text-center">For Doctors</h3>
                <div className="space-y-6">
                  {[
                    { step: 1, title: "Create Your Profile", desc: "Upload credentials, experience, and preferences" },
                    { step: 2, title: "Get Verified", desc: "Our team verifies your medical licenses and certifications" },
                    { step: 3, title: "Browse & Apply", desc: "Find opportunities that match your specialty and location" },
                    { step: 4, title: "Connect & Interview", desc: "Message hospitals directly and schedule interviews" }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* For Hospitals */}
              <div>
                <h3 className="text-2xl font-bold mb-8 text-center">For Hospitals</h3>
                <div className="space-y-6">
                  {[
                    { step: 1, title: "Setup Hospital Profile", desc: "Add facility information, specialties, and culture" },
                    { step: 2, title: "Post Job Openings", desc: "Create detailed job descriptions with requirements" },
                    { step: 3, title: "Review Applications", desc: "Browse qualified candidates with verified credentials" },
                    { step: 4, title: "Hire Top Talent", desc: "Connect with doctors and make offers seamlessly" }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Next Opportunity?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of healthcare professionals who trust MedBridge 
              to advance their careers and find the perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Get Started Today
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}