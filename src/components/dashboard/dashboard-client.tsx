'use client'

import { useAuth } from '@/providers/auth-provider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DoctorDashboard } from '@/components/dashboard/doctor-dashboard'
import { HospitalDashboard } from '@/components/dashboard/hospital-dashboard'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

export function DashboardClient() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <section className="container py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Loading your dashboard...</h1>
        <p className="mt-2 text-muted-foreground">
          Please wait while we prepare your personalized experience.
        </p>
      </section>
    )
  }

  if (!user || !profile) {
    return (
      <section className="container py-8">
        <Alert>
          <AlertDescription>
            Please sign in to access your dashboard.
          </AlertDescription>
        </Alert>
      </section>
    )
  }

  if (profile.role === 'doctor') {
    return <DoctorDashboard name={profile.name} email={user.email} />
  }

  if (profile.role === 'hospital') {
    return <HospitalDashboard name={profile.name} email={user.email} />
  }

  return <AdminDashboard name={profile.name} email={user.email} />
}
