'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, 
  Users, 
  Briefcase, 
  Shield, 
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Building2,
  Heart,
  TrendingUp,
  Award,
  Globe
} from 'lucide-react';

export default function HomePage() {

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4" aria-label="Platform status">
            <TrendingUp className="mr-1 h-3 w-3" aria-hidden="true" />
            Trusted by 10,000+ Healthcare Professionals
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Connecting Healthcare
            <span className="text-primary block mt-2">Professionals</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            The trusted marketplace where qualified doctors find their next opportunity 
            and hospitals discover exceptional medical talent.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="container mx-auto px-4 py-16" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Platform Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { number: '10,000+', label: 'Active Doctors', icon: Users },
            { number: '5,000+', label: 'Healthcare Jobs', icon: Briefcase },
            { number: '500+', label: 'Verified Hospitals', icon: Building2 },
            { number: '95%', label: 'Success Rate', icon: Award },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" aria-hidden="true" />
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20" aria-labelledby="features-heading">
        <div className="text-center mb-16">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose MedBridge?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide the most comprehensive platform for medical professionals and healthcare employers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Shield,
              title: 'Verified Credentials',
              description: 'All doctor profiles are verified with proper medical licenses and certifications',
            },
            {
              icon: Globe,
              title: 'Nationwide Network',
              description: 'Access opportunities across the country from top healthcare facilities',
            },
            {
              icon: Heart,
              title: 'Personalized Matches',
              description: 'Smart algorithm matches you with the most relevant opportunities',
            },
            {
              icon: Clock,
              title: 'Quick Applications',
              description: 'Apply to multiple positions with your profile in just a few clicks',
            },
            {
              icon: Star,
              title: 'Quality Employers',
              description: 'Work with verified hospitals and healthcare facilities you can trust',
            },
            {
              icon: TrendingUp,
              title: 'Career Growth',
              description: 'Find opportunities that align with your career goals and aspirations',
            },
          ].map((feature) => (
            <Card key={feature.title} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mb-4" aria-hidden="true" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-secondary/30 py-20" aria-labelledby="how-it-works-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Create Your Profile',
                description: 'Sign up and complete your professional profile with credentials, experience, and preferences',
              },
              {
                step: '2',
                title: 'Browse & Apply',
                description: 'Search through thousands of verified job opportunities and apply with one click',
              },
              {
                step: '3',
                title: 'Get Hired',
                description: 'Connect with employers, schedule interviews, and land your dream healthcare position',
              },
            ].map((step) => (
              <div key={step.step} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Sections */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* For Doctors */}
          <Card className="border-2 border-primary/20 hover:shadow-xl transition-shadow">
            <CardHeader>
              <Stethoscope className="h-12 w-12 text-primary mb-4" aria-hidden="true" />
              <CardTitle className="text-2xl">For Healthcare Professionals</CardTitle>
              <CardDescription className="text-base">
                Find your next opportunity in seconds. Access exclusive healthcare positions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'Browse thousands of verified positions',
                'Get matched with relevant opportunities',
                'Apply with your professional profile',
                'Track all your applications in one place',
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full">
                <Link href="/auth/signup">
                  Join as a Doctor
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* For Employers */}
          <Card className="border-2 border-primary/20 hover:shadow-xl transition-shadow">
            <CardHeader>
              <Building2 className="h-12 w-12 text-primary mb-4" aria-hidden="true" />
              <CardTitle className="text-2xl">For Healthcare Employers</CardTitle>
              <CardDescription className="text-base">
                Connect with qualified medical professionals. Post jobs and manage applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'Post unlimited job openings',
                'Access verified doctor profiles',
                'Advanced filtering and search',
                'Streamlined application management',
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" variant="outline" className="w-full">
                <Link href="/auth/signup">
                  Join as an Employer
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take the Next Step in Your Career?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of healthcare professionals who have found their perfect match on MedBridge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
