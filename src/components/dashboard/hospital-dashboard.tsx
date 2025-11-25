import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building, Briefcase, Users, MessageSquare } from 'lucide-react'

interface HospitalDashboardProps {
  name: string | null
  email: string
}

export function HospitalDashboard({ name, email }: HospitalDashboardProps) {
  return (
    <section className="container py-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Hospital Dashboard</h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            Welcome, {name || email}. Manage your job postings and candidate pipeline.
          </p>
        </div>
        <Badge variant="secondary">Role: Hospital</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Postings</CardTitle>
            <CardDescription>Open roles visible to doctors</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">4</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Applicants</CardTitle>
            <CardDescription>Applications in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Conversations with candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">6</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage jobs and communication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Link href="/post-job">
                <Button size="sm">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Post a Job
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="outline" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  View All Jobs
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Candidate Messages
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Keep your hospital profile complete and respond quickly to promising candidates.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hiring Overview</CardTitle>
            <CardDescription>High-level view of your pipeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Review new applicants and move them through your hiring stages.</li>
              <li>Highlight urgent roles to attract more applicants.</li>
              <li>Use messages to coordinate interviews with shortlisted doctors.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
