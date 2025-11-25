import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart2, Users, Building, Briefcase } from 'lucide-react'

interface AdminDashboardProps {
  name: string | null
  email: string
}

export function AdminDashboard({ name, email }: AdminDashboardProps) {
  return (
    <section className="container py-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            Welcome, {name || email}. Monitor activity across doctors and hospitals.
          </p>
        </div>
        <Badge variant="secondary">Role: Admin</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Doctors</CardTitle>
            <CardDescription>Registered on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">320</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Hospitals</CardTitle>
            <CardDescription>Partner facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">85</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
            <CardDescription>Currently open positions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">140</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Management</CardTitle>
            <CardDescription>High-level admin actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button variant="outline" size="sm">
                <Building className="mr-2 h-4 w-4" />
                Manage Hospitals
              </Button>
              <Button variant="outline" size="sm">
                <Briefcase className="mr-2 h-4 w-4" />
                Manage Jobs
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Hook these actions into your admin routes and APIs as they are implemented.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>High-level platform overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Monitor usage across doctors, hospitals, and jobs.</li>
              <li>Ensure verification workflows are running smoothly.</li>
              <li>Review reports and take action on flagged accounts.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
