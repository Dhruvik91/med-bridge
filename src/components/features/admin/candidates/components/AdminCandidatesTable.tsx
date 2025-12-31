import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DoctorProfile } from '@/types';
import { format } from 'date-fns';
import { useDataTable, ColumnTotal } from '@/hooks/useDataTable';
import { DataTable, DataTableSortableHeader } from '@/components/ui/data-table';
import { AdminCandidateNameCell } from './AdminCandidateNameCell';
import { AdminCandidateActionsCell } from './AdminCandidateActionsCell';

interface AdminCandidatesTableRefactoredProps {
  candidates: DoctorProfile[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  sentinelRef?: (node?: Element | null) => void;
  onViewCandidate?: (candidate: DoctorProfile) => void;
  onDeleteCandidate?: (candidate: DoctorProfile) => void;
  globalFilter?: string;
  showTotals?: boolean;
}

export function AdminCandidatesTable({
  candidates,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  sentinelRef,
  onViewCandidate,
  onDeleteCandidate,
  globalFilter = '',
  showTotals = false,
}: AdminCandidatesTableRefactoredProps) {
  const columns = useMemo<ColumnDef<DoctorProfile>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: ({ column }) => (
          <DataTableSortableHeader column={column} title="Name" />
        ),
        cell: ({ row }) => <AdminCandidateNameCell candidate={row.original} />,
        enableSorting: true,
      },
      {
        accessorKey: 'experienceYears',
        header: ({ column }) => (
          <DataTableSortableHeader column={column} title="Experience" />
        ),
        cell: ({ row }) => {
          const years = row.original.experienceYears;
          return years ? `${years} years` : 'N/A';
        },
        enableSorting: true,
      },
      {
        accessorKey: 'city',
        header: 'Location',
        cell: ({ row }) => {
          const city = row.original.city;
          const country = row.original.country;
          return city && country ? `${city}, ${country}` : city || country || 'N/A';
        },
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => row.original.phone || 'N/A',
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableSortableHeader column={column} title="Joined" />
        ),
        cell: ({ row }) => {
          return format(new Date(row.original.createdAt), 'MMM dd, yyyy');
        },
        enableSorting: true,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <AdminCandidateActionsCell
            candidate={row.original}
            onView={onViewCandidate}
            onDelete={onDeleteCandidate}
          />
        ),
      },
    ],
    [onViewCandidate, onDeleteCandidate]
  );

  const columnTotals = useMemo<ColumnTotal<DoctorProfile>[]>(
    () => [
      {
        columnId: 'fullName',
        calculate: (rows) => `Total: ${rows.length}`,
      },
      {
        columnId: 'experienceYears',
        calculate: (rows) => {
          const total = rows.reduce((sum, row) => {
            return sum + (row.original.experienceYears || 0);
          }, 0);
          const avg = rows.length > 0 ? (total / rows.length).toFixed(1) : 0;
          return `Avg: ${avg} yrs`;
        },
      },
    ],
    []
  );

  const globalFilterFn = (row: any, columnId: string, filterValue: string): boolean => {
    const candidate = row.original as DoctorProfile;
    const searchValue = filterValue.toLowerCase();
    
    return !!(
      candidate.fullName?.toLowerCase().includes(searchValue) ||
      candidate.user?.email?.toLowerCase().includes(searchValue) ||
      candidate.phone?.toLowerCase().includes(searchValue) ||
      candidate.city?.toLowerCase().includes(searchValue) ||
      candidate.country?.toLowerCase().includes(searchValue)
    );
  };

  const { table, totals } = useDataTable({
    data: candidates,
    columns,
    enableSorting: true,
    enableFiltering: true,
    globalFilterFn,
    columnTotals: showTotals ? columnTotals : [],
  });

  table.getState().globalFilter = globalFilter;

  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      loadingMessage="Loading candidates..."
      emptyMessage="No candidates found"
      totals={totals}
      showTotals={showTotals}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      sentinelRef={sentinelRef}
    />
  );
}
