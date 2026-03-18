import { Metadata } from 'next';
import { JobFormContainer } from '@/components/features/jobs/container/JobFormContainer';

export const metadata: Metadata = {
  title: 'Post a New Job | Med-Bridge',
  description: 'Create a new job opportunity to find the best healthcare professionals.',
};


export default function CreateJobPage() {
  return <JobFormContainer mode="create" />;
}
