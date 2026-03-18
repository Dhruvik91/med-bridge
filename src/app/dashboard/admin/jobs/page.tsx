import { Metadata } from 'next';
import { AdminJobsContainer } from '@/components/features/admin/jobs/AdminJobsContainer';

export const metadata: Metadata = {
  title: 'Manage Jobs | Admin | Med-Bridge',
  description: 'Admin interface to manage job postings across the platform.',
};

export default function AdminJobsPage() {
  return <AdminJobsContainer />;
}
