import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Qualification } from '@/types';
import { SearchableSelect } from './SearchableSelect';

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
            <SearchableSelect
                items={unselectedQualifications}
                onSelect={onAddQualification}
                onOthersClick={onCreateNew}
                placeholder="Select a qualification"
                noResultsMessage="No qualification found."
            />

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
