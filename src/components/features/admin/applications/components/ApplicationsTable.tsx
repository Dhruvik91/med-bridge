import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Application } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';

interface ApplicationsTableProps {
  applications: Application[];
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  sentinelRef?: (node: HTMLTableRowElement | null) => void;
  onViewDetails?: (application: Application) => void;
  onDelete?: (application: Application) => void;
}

export function ApplicationsTable({
  applications,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  sentinelRef,
  onViewDetails,
  onDelete,
}: ApplicationsTableProps) {
  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: 'candidate',
        header: 'Candidate',
        cell: ({ row }) => {
          const profile = row.original.candidateProfile;
          return (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={profile?.avatarUrl || undefined} />
                <AvatarFallback>
                  {profile?.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{profile?.fullName || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">
                  {row.original.candidate?.email}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'job',
        header: 'Job',
        cell: ({ row }) => {
          const job = row.original.job;
          return (
            <div>
              <div className="font-medium">{job?.title || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">
                {job?.employerProfile?.name || 'N/A'}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <ApplicationStatusBadge status={row.original.status} />
        ),
      },
      {
        accessorKey: 'coverLetter',
        header: 'Cover Letter',
        cell: ({ row }) => {
          const letter = row.original.coverLetter;
          return letter ? (
            <div className="max-w-xs truncate">{letter}</div>
          ) : (
            'N/A'
          );
        },
      },
      {
        accessorKey: 'appliedAt',
        header: 'Applied On',
        cell: ({ row }) => {
          return format(new Date(row.original.appliedAt), 'MMM dd, yyyy');
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails?.(row.original)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete?.(row.original)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onViewDetails, onDelete]
  );

  const table = useReactTable({
    data: applications,
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
                    No applications found
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
