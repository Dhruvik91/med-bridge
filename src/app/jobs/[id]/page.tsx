import { Metadata } from 'next';
import { JobDetail } from '@/components/features/jobs/container/JobDetail';

export const metadata: Metadata = {
  title: 'Job Details',
  description: 'View job details and apply on MedBridges.',
};

export default function JobDetailPage() {
  return <JobDetail />;
}
