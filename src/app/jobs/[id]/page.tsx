import { Metadata } from 'next';
import { JobDetail } from '@/components/features/jobs/container/JobDetail';
import { API_CONFIG } from '@/constants/constants';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}${API_CONFIG.path.jobs.base}/${id}`);

    if (!response.ok) {
      return {
        title: 'Job Not Found',
        description: 'The requested job could not be found.',
      };
    }

    const job = await response.json();

    return {
      title: `${job.title} at ${job.organization?.name || job.employerProfile?.name || 'Healthcare Facility'}`,
      description: `${job.title} in ${job.location?.city}, ${job.location?.state}. Apply now on MedBridges.`,
      openGraph: {
        title: `${job.title}`,
        description: `Hiring: ${job.title}. Apply now!`,
      },
    };
  } catch (error) {
    return {
      title: 'Job Details',
      description: 'View job details and apply on MedBridges.',
    };
  }
}

export default function JobDetailPage() {
  return <JobDetail />;
}

