'use client';

import { useState, useMemo } from 'react';
import { useInfiniteAdminApplications } from '@/hooks/admin/useInfiniteAdminApplications';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Application, ApplicationStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Search, MoreVertical, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminApplicationsPage() {
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
        cell: ({ row }) => {
          const status = row.original.status;
          const statusColors = {
            applied: 'bg-blue-100 text-blue-800',
            viewed: 'bg-purple-100 text-purple-800',
            shortlisted: 'bg-yellow-100 text-yellow-800',
            interview: 'bg-orange-100 text-orange-800',
            offer: 'bg-green-100 text-green-800',
            hired: 'bg-teal-100 text-teal-800',
            rejected: 'bg-red-100 text-red-800',
            withdrawn: 'bg-gray-100 text-gray-800',
          };
          return (
            <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
              {status}
            </Badge>
          );
        },
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
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: allApplications,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by candidate or job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Status</option>
              <option value="applied">Applied</option>
              <option value="viewed">Viewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
