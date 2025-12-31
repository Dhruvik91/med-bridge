import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataTableSearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  title?: string;
  showClear?: boolean;
  className?: string;
}

export function DataTableSearchFilter({
  value,
  onChange,
  placeholder = 'Search...',
  title = 'Search',
  showClear = true,
  className,
}: DataTableSearchFilterProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {showClear && value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
