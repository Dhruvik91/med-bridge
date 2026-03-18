import { Metadata } from 'next';
import { AdminDashboardContainer } from '@/components/features/admin/dashboard/AdminDashboardContainer';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Med-Bridge',
  description: 'Control center for Med-Bridge administrators.',
};

export default function AdminDashboardPage() {
  return <AdminDashboardContainer />;
}
