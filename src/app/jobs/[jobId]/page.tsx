import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { JobDetailClient } from '@/components/jobs/job-detail-client'

type Props = {
  params: { jobId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In a real app, you'd fetch the job data here
  return {
    title: `Job Details | MedBridge`,
    description: 'View detailed information about this medical job opportunity.',
    alternates: {
      canonical: `/jobs/${params.jobId}`
    }
  }
}

export default function JobDetailPage({ params }: Props) {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen bg-background">
        <JobDetailClient jobId={params.jobId} />
      </main>
    </>
  )
}
