'use client';

import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Users, Briefcase, FileText, Building2, LayoutDashboard, UserCheck } from 'lucide-react';

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/dashboard/admin/users',
    icon: Users,
  },
  {
    title: 'Candidates',
    href: '/dashboard/admin/candidates',
    icon: UserCheck,
  },
  {
    title: 'Employers',
    href: '/dashboard/admin/employers',
    icon: Building2,
  },
  {
    title: 'Jobs',
    href: '/dashboard/admin/jobs',
    icon: Briefcase,
  },
  {
    title: 'Applications',
    href: '/dashboard/admin/applications',
    icon: FileText,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
