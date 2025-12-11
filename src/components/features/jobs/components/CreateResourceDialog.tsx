import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ResourceType = 'organization' | 'location' | 'specialty';

interface CreateResourceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    resourceType: ResourceType;
    formData: any;
    onFormDataChange: (data: any) => void;
    onCreate: () => void;
    isCreating: boolean;
}

export const CreateResourceDialog = ({
    isOpen,
    onClose,
    resourceType,
    formData,
    onFormDataChange,
    onCreate,
    isCreating,
}: CreateResourceDialogProps) => {
    const getTitle = () => {
        switch (resourceType) {
            case 'organization':
                return 'Create New Organization';
            case 'location':
                return 'Create New Location';
            case 'specialty':
                return 'Create New Specialty';
        }
    };

    const getDescription = () => {
        switch (resourceType) {
            case 'organization':
                return 'Add a new healthcare organization to the system';
            case 'location':
                return 'Add a new location for job postings';
            case 'specialty':
                return 'Add a new medical specialty';
        }
    };

    const renderFields = () => {
        switch (resourceType) {
            case 'organization':
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="org-name">Organization Name *</Label>
                            <Input
                                id="org-name"
                                value={formData.name || ''}
                                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                                placeholder="Enter organization name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="org-description">Description</Label>
                            <Textarea
                                id="org-description"
                                value={formData.description || ''}
                                onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
                                placeholder="Enter organization description"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="org-website">Website</Label>
                            <Input
                                id="org-website"
                                type="url"
                                value={formData.website || ''}
                                onChange={(e) => onFormDataChange({ ...formData, website: e.target.value })}
                                placeholder="https://example.com"
                            />
                        </div>
                    </>
                );

            case 'location':
                return (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="loc-city">City *</Label>
                                <Input
                                    id="loc-city"
                                    value={formData.city || ''}
                                    onChange={(e) => onFormDataChange({ ...formData, city: e.target.value })}
                                    placeholder="Enter city"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="loc-state">State/Province</Label>
                                <Input
                                    id="loc-state"
                                    value={formData.state || ''}
                                    onChange={(e) => onFormDataChange({ ...formData, state: e.target.value })}
                                    placeholder="Enter state"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="loc-country">Country *</Label>
                            <Input
                                id="loc-country"
                                value={formData.country || ''}
                                onChange={(e) => onFormDataChange({ ...formData, country: e.target.value })}
                                placeholder="Enter country"
                            />
                        </div>
                    </>
                );

            case 'specialty':
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="spec-name">Specialty Name *</Label>
                            <Input
                                id="spec-name"
                                value={formData.name || ''}
                                onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
                                placeholder="Enter specialty name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="spec-description">Description</Label>
                            <Textarea
                                id="spec-description"
                                value={formData.description || ''}
                                onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
                                placeholder="Enter specialty description"
                                rows={3}
                            />
                        </div>
                    </>
                );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{getTitle()}</DialogTitle>
                    <DialogDescription>{getDescription()}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {renderFields()}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onCreate} disabled={isCreating}>
                        {isCreating ? 'Creating...' : `Create ${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
