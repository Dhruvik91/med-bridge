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
        title: 'Job Not Found | MedBridge',
        description: 'The requested job could not be found.',
      };
    }

    const job = await response.json();

    return {
      title: `${job.title} at ${job.organization?.name || job.employerProfile?.name || 'Healthcare Facility'} | MedBridge`,
      description: `${job.title} in ${job.location?.city}, ${job.location?.state}. Apply now on MedBridge.`,
      openGraph: {
        title: `${job.title} | MedBridge`,
        description: `Hiring: ${job.title}. Apply now!`,
      },
    };
  } catch (error) {
    return {
      title: 'Job Details | MedBridge',
      description: 'View job details and apply on MedBridge.',
    };
  }
}

export default function JobDetailPage() {
  return <JobDetail />;
}

