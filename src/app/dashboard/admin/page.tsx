'use client';

import { useAdminStats } from '@/hooks/admin/useAdminStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FileText, Building2, TrendingUp, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/dashboard/admin/users',
    },
    {
      title: 'Candidates',
      value: stats?.totalCandidates || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/dashboard/admin/candidates',
    },
    {
      title: 'Employers',
      value: stats?.totalEmployers || 0,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/dashboard/admin/employers',
    },
    {
      title: 'Total Jobs',
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/dashboard/admin/jobs',
    },
    {
      title: 'Active Jobs',
      value: stats?.activeJobs || 0,
      icon: CheckCircle,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      link: '/dashboard/admin/jobs',
    },
    {
      title: 'Applications',
      value: stats?.totalApplications || 0,
      icon: FileText,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      link: '/dashboard/admin/applications',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, jobs, and applications
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.link}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer glass-enhanced">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? '...' : stat.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-enhanced transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/dashboard/admin/users"
              className="block p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">Manage Users</div>
              <div className="text-sm text-muted-foreground">
                View and manage all users
              </div>
            </Link>
            <Link
              href="/dashboard/admin/jobs"
              className="block p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">Manage Jobs</div>
              <div className="text-sm text-muted-foreground">
                View and manage all job postings
              </div>
            </Link>
            <Link
              href="/dashboard/admin/applications"
              className="block p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="font-medium">Manage Applications</div>
              <div className="text-sm text-muted-foreground">
                View and manage all applications
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-enhanced transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
              <span className="text-sm font-medium">Published Jobs</span>
              <span className="text-lg font-bold">
                {isLoading ? '...' : stats?.publishedJobs || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
              <span className="text-sm font-medium">Total Applications</span>
              <span className="text-lg font-bold">
                {isLoading ? '...' : stats?.totalApplications || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
