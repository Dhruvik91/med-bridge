import { Metadata } from 'next';
import { EmployerDashboard } from '@/components/features/dashboard/container/EmployerDashboard';

export const metadata: Metadata = {
  title: 'Employer Dashboard | Med-Bridge',
  description: 'Manage your job postings, track applications, and find the best healthcare professionals.',
};


export default function EmployerDashboardPage() {
  return <EmployerDashboard />;
}
