import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Row,
} from '@tanstack/react-table';

export interface ColumnTotal<TData> {
  columnId: string;
  calculate: (rows: Row<TData>[]) => string | number;
  label?: string;
}

export interface UseDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  globalFilterFn?: (row: Row<TData>, columnId: string, filterValue: any) => boolean;
  columnTotals?: ColumnTotal<TData>[];
  enableColumnVisibility?: boolean;
}

export interface UseDataTableReturn<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (filters: ColumnFiltersState | ((prev: ColumnFiltersState) => ColumnFiltersState)) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState | ((prev: SortingState) => SortingState)) => void;
  columnVisibility: VisibilityState;
  setColumnVisibility: (visibility: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void;
  totals: Record<string, string | number>;
  resetFilters: () => void;
  resetSorting: () => void;
  resetAll: () => void;
}

export function useDataTable<TData>({
  data,
  columns,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = false,
  pageSize = 10,
  globalFilterFn,
  columnTotals = [],
  enableColumnVisibility = false,
}: UseDataTableProps<TData>): UseDataTableReturn<TData> {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enableFiltering && {
      getFilteredRowModel: getFilteredRowModel(),
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: globalFilterFn as any,
    }),
    ...(enableSorting && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
    }),
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    ...(enableColumnVisibility && {
      onColumnVisibilityChange: setColumnVisibility,
    }),
    state: {
      globalFilter,
      columnFilters,
      sorting,
      columnVisibility,
      ...(enablePagination && { pagination: { pageIndex: 0, pageSize } }),
    },
  });

  const totals = useMemo(() => {
    const calculatedTotals: Record<string, string | number> = {};
    const rows = table.getFilteredRowModel().rows;

    columnTotals.forEach((total) => {
      calculatedTotals[total.columnId] = total.calculate(rows);
    });

    return calculatedTotals;
  }, [table.getFilteredRowModel().rows, columnTotals]);

  const resetFilters = useCallback(() => {
    setGlobalFilter('');
    setColumnFilters([]);
  }, []);

  const resetSorting = useCallback(() => {
    setSorting([]);
  }, []);

  const resetAll = useCallback(() => {
    resetFilters();
    resetSorting();
    setColumnVisibility({});
  }, [resetFilters, resetSorting]);

  return {
    table,
    globalFilter,
    setGlobalFilter,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility,
    totals,
    resetFilters,
    resetSorting,
    resetAll,
  };
}
