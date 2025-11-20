import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { ProfileClient } from '@/components/profile/profile-client'

export const metadata: Metadata = {
  title: 'My Profile | MedBridge',
  description: 'Manage your professional profile, credentials, and preferences on MedBridge.',
  alternates: {
    canonical: '/profile'
  }
}

export default function ProfilePage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen bg-background">
        <ProfileClient />
      </main>
    </>
  )
}
