import { Metadata } from 'next';
import { SavedJobs } from '@/components/features/saved-jobs/container/SavedJobs';

export const metadata: Metadata = {
  title: 'Saved Jobs | MedBridge',
  description: 'View and manage your saved healthcare job opportunities.',
};

export default function SavedJobsPage() {
  return <SavedJobs />;
}
