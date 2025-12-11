import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';

interface Specialty {
    id: string;
    name: string;
}

interface SpecialtySelectorProps {
    availableSpecialties: Specialty[];
    selectedSpecialties: Specialty[];
    onAddSpecialty: (specialtyId: string) => void;
    onRemoveSpecialty: (specialtyId: string) => void;
    onCreateNew: () => void;
}

export const SpecialtySelector = ({
    availableSpecialties,
    selectedSpecialties,
    onAddSpecialty,
    onRemoveSpecialty,
    onCreateNew,
}: SpecialtySelectorProps) => {
    const unselectedSpecialties = availableSpecialties.filter(
        (spec) => !selectedSpecialties.some((selected) => selected.id === spec.id)
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Specialties</CardTitle>
                <CardDescription>Select the medical specialties relevant to this position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Select onValueChange={onAddSpecialty}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a specialty" />
                        </SelectTrigger>
                        <SelectContent>
                            {unselectedSpecialties.map((specialty) => (
                                <SelectItem key={specialty.id} value={specialty.id}>
                                    {specialty.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" onClick={onCreateNew}>
                        <Plus className="h-4 w-4 mr-2" />
                        New
                    </Button>
                </div>

                {selectedSpecialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {selectedSpecialties.map((specialty) => (
                            <Badge key={specialty.id} variant="secondary" className="text-sm">
                                {specialty.name}
                                <button
                                    type="button"
                                    onClick={() => onRemoveSpecialty(specialty.id)}
                                    className="ml-2 hover:text-destructive"
                                    aria-label={`Remove ${specialty.name}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}

                {selectedSpecialties.length === 0 && (
                    <p className="text-sm text-muted-foreground">No specialties selected</p>
                )}
            </CardContent>
        </Card>
    );
};
