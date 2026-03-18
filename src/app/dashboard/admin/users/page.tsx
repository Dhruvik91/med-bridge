import { Metadata } from 'next';
import { AdminUsersContainer } from '@/components/features/admin/users/AdminUsersContainer';

export const metadata: Metadata = {
  title: 'Manage Users | Admin | Med-Bridge',
  description: 'Admin interface to manage users and roles.',
};

export default function AdminUsersPage() {
  return <AdminUsersContainer />;
}
