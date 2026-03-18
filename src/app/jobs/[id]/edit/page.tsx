import { Metadata } from 'next';
import { JobEditContainer } from '@/components/features/jobs/container/JobEditContainer';
import { jobService } from '@/services/job.service';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const job = await jobService.findOne(params.id);
    return {
      title: `Edit ${job.title} | Med-Bridge`,
      description: `Refine the job posting for ${job.title} at ${job.organization?.name || 'your organization'}.`,
    };
  } catch (error) {
    return {
      title: 'Edit Job | Med-Bridge',
    };
  }
}

export default function EditJobPage({ params }: Props) {
  return <JobEditContainer jobId={params.id} />;
}
