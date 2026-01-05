'use client';

import { useState, useMemo } from 'react';
import { useInfiniteAdminCandidates } from '@/hooks/admin/useInfiniteAdminCandidates';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { DoctorProfile } from '@/types';
import { AdminCandidatesPageHeader } from '../components/AdminCandidatesPageHeader';
import { AdminCandidatesSearchFilter } from '../components/AdminCandidatesSearchFilter';
import { AdminCandidatesTable } from '../components/AdminCandidatesTable';

export function AdminCandidatesDashboardContainer() {
  const [searchQuery, setSearchQuery] = useState('');

  const queryParams = useMemo(() => {
    const params: any = {};
    if (searchQuery) params.q = searchQuery;
    return params;
  }, [searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteAdminCandidates(queryParams, 20);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const allCandidates = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const handleViewCandidate = (candidate: DoctorProfile) => {
    console.log('View candidate:', candidate);
  };

  const handleDeleteCandidate = (candidate: DoctorProfile) => {
    console.log('Delete candidate:', candidate);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <AdminCandidatesPageHeader
        title="Candidates Management"
        description="Manage all candidate profiles"
      />

      <AdminCandidatesSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AdminCandidatesTable
        candidates={allCandidates}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        sentinelRef={sentinelRef}
        onViewCandidate={handleViewCandidate}
        onDeleteCandidate={handleDeleteCandidate}
      />
    </div>
  );
}
