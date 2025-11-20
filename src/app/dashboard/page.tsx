import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export const metadata: Metadata = {
  title: 'Dashboard | MedBridge',
  description: 'Personalized dashboard for doctors, hospitals, and admins on MedBridge.',
  alternates: {
    canonical: '/dashboard',
  },
}

export default function DashboardPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen bg-background">
        <DashboardClient />
      </main>
    </>
  )
}
