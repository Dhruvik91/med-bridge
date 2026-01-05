import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AdminCandidatesSearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function AdminCandidatesSearchFilter({
  searchQuery,
  onSearchChange,
}: AdminCandidatesSearchFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>
  );
}
