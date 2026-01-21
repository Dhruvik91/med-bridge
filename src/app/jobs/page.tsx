import { Metadata } from 'next';
import { JobsBrowse } from '@/components/features/jobs/container/JobsBrowse';

export const metadata: Metadata = {
  title: 'Browse Healthcare Jobs',
  description: 'Search and apply for the latest healthcare jobs. Find opportunities for doctors, nurses, and medical professionals across top hospitals and clinics.',
  keywords: ['medical jobs', 'healthcare careers', 'doctor jobs', 'nursing jobs', 'hospital recruitment'],
};

export default function JobsPage() {
  return <JobsBrowse />;
}
