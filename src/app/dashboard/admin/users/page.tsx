'use client';

import { useState, useMemo } from 'react';
import { useInfiniteAdminUsers } from '@/hooks/admin/useInfiniteAdminUsers';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { User, UserRole } from '@/types';
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
import { Search, MoreVertical, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  const queryParams = useMemo(() => {
    const params: any = {};
    if (searchQuery) params.q = searchQuery;
    if (roleFilter) params.role = roleFilter;
    return params;
  }, [searchQuery, roleFilter]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteAdminUsers(queryParams, 20);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const allUsers = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <div className="font-medium">{row.original.email}</div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
          const role = row.original.role;
          const roleColors = {
            admin: 'bg-red-100 text-red-800',
            employer: 'bg-blue-100 text-blue-800',
            candidate: 'bg-green-100 text-green-800',
          };
          return (
            <Badge className={roleColors[role] || 'bg-gray-100 text-gray-800'}>
              {role}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'isEmailVerified',
        header: 'Verified',
        cell: ({ row }) => {
          const isVerified = row.original.isEmailVerified;
          return isVerified ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-400" />
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
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
                <Edit className="h-4 w-4 mr-2" />
                Edit
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
    data: allUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all users in the system
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
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="employer">Employer</option>
              <option value="candidate">Candidate</option>
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
                      No users found
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
