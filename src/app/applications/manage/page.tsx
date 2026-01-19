import { Metadata } from 'next';
import { ManageApplications } from '@/components/features/applications/container/ManageApplications';

export const metadata: Metadata = {
  title: 'Manage Applications | MedBridge',
  description: 'Track and manage your job applications.',
};

export default function ManageApplicationsPage() {
  return <ManageApplications />;
}
