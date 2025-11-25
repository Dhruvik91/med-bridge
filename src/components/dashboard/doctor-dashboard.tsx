import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stethoscope, Briefcase, Users, MessageSquare } from 'lucide-react'

interface DoctorDashboardProps {
  name: string | null
  email: string
}

export function DoctorDashboard({ name, email }: DoctorDashboardProps) {
  return (
    <section className="container py-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Doctor Dashboard</h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {name || email}. Here&apos;s an overview of your activity.
          </p>
        </div>
        <Badge variant="secondary">Role: Doctor</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Saved Jobs</CardTitle>
            <CardDescription>Opportunities you&apos;re tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>In progress or under review</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>From hospitals &amp; recruiters</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your search and profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Link href="/jobs">
                <Button size="sm">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Jobs
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Messages
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Keep your profile and preferences updated to get better job matches.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggested Next Steps</CardTitle>
            <CardDescription>Recommendations to improve your visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Complete your profile details and upload your CV.</li>
              <li>Save jobs you&apos;re interested in to track them easily.</li>
              <li>Respond promptly to hospital messages to keep momentum.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
