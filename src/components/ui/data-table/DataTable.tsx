import { ReactNode } from 'react';
import { flexRender, Table as TanstackTable } from '@tanstack/react-table';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  totals?: Record<string, string | number>;
  showTotals?: boolean;
  enablePagination?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  sentinelRef?: (node?: Element | null) => void;
  className?: string;
  headerActions?: ReactNode;
  footerContent?: ReactNode;
}

export function DataTable<TData>({
  table,
  isLoading = false,
  loadingMessage = 'Loading...',
  emptyMessage = 'No data found',
  totals = {},
  showTotals = false,
  enablePagination = false,
  hasNextPage,
  isFetchingNextPage,
  sentinelRef,
  className,
  headerActions,
  footerContent,
}: DataTableProps<TData>) {
  const columns = table.getAllColumns();
  const columnCount = columns.length;

  return (
    <Card className={className}>
      {headerActions && (
        <div className="p-4 border-b">
          {headerActions}
        </div>
      )}
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
                  <TableCell colSpan={columnCount} className="text-center py-8">
                    {loadingMessage}
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columnCount} className="text-center py-8">
                    {emptyMessage}
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
                      <TableCell colSpan={columnCount} className="text-center py-4">
                        {isFetchingNextPage ? 'Loading more...' : 'Load more'}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
            {showTotals && Object.keys(totals).length > 0 && !isLoading && (
              <TableFooter>
                <TableRow>
                  {columns.map((column) => {
                    const columnId = column.id;
                    const total = totals[columnId];
                    
                    return (
                      <TableCell key={columnId} className="font-semibold">
                        {total !== undefined ? total : ''}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
        {enablePagination && !hasNextPage && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        {footerContent && (
          <div className="p-4 border-t">
            {footerContent}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
