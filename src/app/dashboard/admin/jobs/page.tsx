'use client';

import { useState, useMemo } from 'react';
import { useInfiniteAdminJobs } from '@/hooks/admin/useInfiniteAdminJobs';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Job, JobStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Search, MoreVertical, Trash2, Eye, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminJobsPage() {
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
  } = useInfiniteAdminJobs(queryParams, 20);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const allJobs = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const columns = useMemo<ColumnDef<Job>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Job Title',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.title}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.employerProfile?.name || 'N/A'}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'jobType',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.original.jobType?.replace('_', ' ');
          return (
            <Badge variant="outline" className="capitalize">
              {type}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          const statusColors = {
            published: 'bg-green-100 text-green-800',
            draft: 'bg-gray-100 text-gray-800',
            closed: 'bg-red-100 text-red-800',
            archived: 'bg-yellow-100 text-yellow-800',
          };
          return (
            <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => {
          const location = row.original.location;
          return location ? (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{location.city}, {location.country}</span>
            </div>
          ) : (
            'N/A'
          );
        },
      },
      {
        accessorKey: 'salary',
        header: 'Salary Range',
        cell: ({ row }) => {
          const min = row.original.salaryMin;
          const max = row.original.salaryMax;
          const currency = row.original.currency || 'USD';
          if (min && max) {
            const minNum = typeof min === 'string' ? parseFloat(min) : min;
            const maxNum = typeof max === 'string' ? parseFloat(max) : max;
            return `${currency} ${minNum.toLocaleString()} - ${maxNum.toLocaleString()}`;
          }
          return 'N/A';
        },
      },
      {
        accessorKey: 'viewsCount',
        header: 'Views',
        cell: ({ row }) => row.original.viewsCount || 0,
      },
      {
        accessorKey: 'createdAt',
        header: 'Posted',
        cell: ({ row }) => {
          return format(new Date(row.original.createdAt), 'MMM dd, yyyy');
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
    data: allJobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jobs Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all job postings
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
                placeholder="Search by job title..."
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
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
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
                      No jobs found
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
