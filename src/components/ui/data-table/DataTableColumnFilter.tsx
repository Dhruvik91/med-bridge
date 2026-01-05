import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface ColumnFilterConfig {
  columnId: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'date';
  options?: FilterOption[];
  placeholder?: string;
}

interface DataTableColumnFilterProps {
  filters: ColumnFilterConfig[];
  values: Record<string, any>;
  onChange: (columnId: string, value: any) => void;
  onReset?: () => void;
  title?: string;
  className?: string;
}

export function DataTableColumnFilter({
  filters,
  values,
  onChange,
  onReset,
  title = 'Filters',
  className,
}: DataTableColumnFilterProps) {
  const hasActiveFilters = Object.values(values).some((v) => v !== '' && v !== undefined);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {hasActiveFilters && onReset && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.columnId} className="space-y-2">
            <Label htmlFor={filter.columnId}>{filter.label}</Label>
            {filter.type === 'select' && filter.options ? (
              <Select
                value={values[filter.columnId] || ''}
                onValueChange={(value) => onChange(filter.columnId, value)}
              >
                <SelectTrigger id={filter.columnId}>
                  <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={filter.columnId}
                type={filter.type}
                placeholder={filter.placeholder || `Filter by ${filter.label}`}
                value={values[filter.columnId] || ''}
                onChange={(e) => onChange(filter.columnId, e.target.value)}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
