import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { DoctorProfile } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { AdminCandidateNameCell } from './AdminCandidateNameCell';
import { AdminCandidateActionsCell } from './AdminCandidateActionsCell';

interface AdminCandidatesTableProps {
  candidates: DoctorProfile[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  sentinelRef?: (node?: Element | null) => void;
  onViewCandidate?: (candidate: DoctorProfile) => void;
  onDeleteCandidate?: (candidate: DoctorProfile) => void;
}

export function AdminCandidatesTable({
  candidates,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  sentinelRef,
  onViewCandidate,
  onDeleteCandidate,
}: AdminCandidatesTableProps) {
  const columns = useMemo<ColumnDef<DoctorProfile>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: 'Name',
        cell: ({ row }) => <AdminCandidateNameCell candidate={row.original} />,
      },
      {
        accessorKey: 'experienceYears',
        header: 'Experience',
        cell: ({ row }) => {
          const years = row.original.experienceYears;
          return years ? `${years} years` : 'N/A';
        },
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
        header: 'Joined',
        cell: ({ row }) => {
          return format(new Date(row.original.createdAt), 'MMM dd, yyyy');
        },
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

  const table = useReactTable({
    data: candidates,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8">
                    No candidates found
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {hasNextPage && (
                    <TableRow ref={sentinelRef}>
                      <TableCell colSpan={columns.length} className="text-center py-4">
                        {isFetchingNextPage ? 'Loading more...' : 'Load more'}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
