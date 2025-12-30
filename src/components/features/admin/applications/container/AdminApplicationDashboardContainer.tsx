'use client';

import { useState, useMemo } from 'react';
import { useInfiniteAdminApplications } from '@/hooks/admin/useInfiniteAdminApplications';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Application } from '@/types';
import { ApplicationsFilters } from '../components/ApplicationsFilters';
import { ApplicationsTable } from '../components/ApplicationsTable';

export function AdminApplicationDashboardContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const queryParams = useMemo(() => {
    const params: any = {};
    if (searchQuery) params.q = searchQuery;
    if (statusFilter) params.status = statusFilter;
    return params;
  }, [searchQuery, statusFilter]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteAdminApplications(queryParams, 20);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const allApplications = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const handleViewDetails = (application: Application) => {
    console.log('View details:', application);
  };

  const handleDelete = (application: Application) => {
    console.log('Delete application:', application);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applications Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all job applications
          </p>
        </div>
      </div>

        <ApplicationsFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
        />

        <ApplicationsTable
          applications={allApplications}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          sentinelRef={sentinelRef}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
        />
    </div>)
};
