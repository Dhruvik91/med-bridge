import { Metadata } from 'next';
import { Applications } from '@/components/features/applications/container/Applications';

export const metadata: Metadata = {
  title: 'My Applications | Med-Bridge',
  description: 'Track and manage your healthcare job applications.',
};


export default function ApplicationsPage() {
  return <Applications />;
}
