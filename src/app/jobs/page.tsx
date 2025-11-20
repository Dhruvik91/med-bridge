import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { JobsListingClient } from '@/components/jobs/jobs-listing-client'

export const metadata: Metadata = {
  title: 'Medical Jobs - Find Healthcare Opportunities | MedBridge',
  description: 'Browse thousands of medical job opportunities from top healthcare facilities. Find your next career move in medicine.',
  alternates: {
    canonical: '/jobs'
  }
}

export default function JobsPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen bg-background">
        <JobsListingClient />
      </main>
    </>
  )
}
