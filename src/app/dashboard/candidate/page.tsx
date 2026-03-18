import { Metadata } from 'next';
import { CandidateDashboard } from '@/components/features/dashboard/container/CandidateDashboard';

export const metadata: Metadata = {
  title: 'Candidate Dashboard | Med-Bridge',
  description: 'Manage your job applications, profile, and discover new opportunities in the healthcare sector.',
};


export default function CandidateDashboardPage() {
  return <CandidateDashboard />;
}
