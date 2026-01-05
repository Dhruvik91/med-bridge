'use client';

import { useState, useMemo } from 'react';
import { useInfiniteAdminEmployers } from '@/hooks/admin/useInfiniteAdminEmployers';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { EmployerProfile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Search, MoreVertical, Trash2, Eye, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminEmployersPage() {
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
  } = useInfiniteAdminEmployers(queryParams, 20);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const allEmployers = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const columns = useMemo<ColumnDef<EmployerProfile>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Company Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={row.original.logoUrl || undefined} />
              <AvatarFallback>
                {row.original.name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.original.name}</div>
              <div className="text-sm text-muted-foreground">
                {row.original.user?.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'contactPerson',
        header: 'Contact Person',
        cell: ({ row }) => row.original.contactPerson || 'N/A',
      },
      {
        accessorKey: 'location',
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
        accessorKey: 'website',
        header: 'Website',
        cell: ({ row }) => {
          const website = row.original.website;
          return website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              Visit <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            'N/A'
          );
        },
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
    data: allEmployers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employers Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all employer profiles
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
                      No employers found
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
