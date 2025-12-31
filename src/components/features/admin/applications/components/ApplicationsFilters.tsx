import { DataTableSearchFilter, DataTableColumnFilter, ColumnFilterConfig } from '@/components/ui/data-table';

interface ApplicationsFiltersProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const STATUS_FILTER_CONFIG: ColumnFilterConfig[] = [
  {
    columnId: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'applied', label: 'Applied' },
      { value: 'viewed', label: 'Viewed' },
      { value: 'shortlisted', label: 'Shortlisted' },
      { value: 'interview', label: 'Interview' },
      { value: 'offer', label: 'Offer' },
      { value: 'hired', label: 'Hired' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'withdrawn', label: 'Withdrawn' },
    ],
    placeholder: 'All Status',
  },
];

export function ApplicationsFilters({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: ApplicationsFiltersProps) {
  const handleFilterChange = (columnId: string, value: any) => {
    if (columnId === 'status') {
      onStatusChange(value);
    }
  };

  const handleResetFilters = () => {
    onStatusChange('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DataTableSearchFilter
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by candidate or job..."
        title="Search Applications"
      />
      <DataTableColumnFilter
        filters={STATUS_FILTER_CONFIG}
        values={{ status: statusFilter }}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        title="Filters"
      />
    </div>
  );
}
