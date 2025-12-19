import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { Qualification } from '@/types';

interface QualificationSelectorProps {
    availableQualifications: Qualification[];
    selectedQualifications: Qualification[];
    onAddQualification: (qualificationId: string) => void;
    onRemoveQualification: (qualificationId: string) => void;
    onCreateNew: () => void;
}

export const QualificationSelector = ({
    availableQualifications,
    selectedQualifications,
    onAddQualification,
    onRemoveQualification,
    onCreateNew,
}: QualificationSelectorProps) => {
    const unselectedQualifications = availableQualifications.filter(
        (qual) => !selectedQualifications.some((selected) => selected.id === qual.id)
    );

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Select onValueChange={onAddQualification}>
                    <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a qualification" />
                    </SelectTrigger>
                    <SelectContent>
                        {unselectedQualifications.map((qualification) => (
                            <SelectItem key={qualification.id} value={qualification.id}>
                                {qualification.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button type="button" variant="outline" onClick={onCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    New
                </Button>
            </div>

            {selectedQualifications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedQualifications.map((qualification) => (
                        <Badge key={qualification.id} variant="secondary" className="text-sm">
                            {qualification.name}
                            <button
                                type="button"
                                onClick={() => onRemoveQualification(qualification.id)}
                                className="ml-2 hover:text-destructive"
                                aria-label={`Remove ${qualification.name}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
};
