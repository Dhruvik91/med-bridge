import { Metadata } from 'next';
import { JobsManage } from '@/components/features/jobs/container/JobsManage';

export const metadata: Metadata = {
  title: 'Manage Your Job Postings | Med-Bridge',
  description: 'View and manage the jobs you have posted on Med-Bridge.',
};


export default function ManageJobsPage() {
  return <JobsManage />;
}

