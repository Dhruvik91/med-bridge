'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateSpecialty } from '@/hooks/post/useCreateSpecialty';

interface AddSpecialtyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSpecialtyCreated: (specialtyId: string) => void;
}

export const AddSpecialtyModal = ({
    isOpen,
    onClose,
    onSpecialtyCreated,
}: AddSpecialtyModalProps) => {
    const [specialtyFormData, setSpecialtyFormData] = useState({
        name: '',
        description: '',
    });

    const createSpecialtyMutation = useCreateSpecialty({
        onSuccess: (specialty) => {
            onSpecialtyCreated(specialty.id);
            handleClose();
        },
    });

    const handleClose = () => {
        setSpecialtyFormData({ name: '', description: '' });
        onClose();
    };

    const handleCreateNew = () => {
        if (specialtyFormData.name.trim()) {
            createSpecialtyMutation.mutate({
                name: specialtyFormData.name.trim(),
                description: specialtyFormData.description.trim() || undefined,
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Specialty</DialogTitle>
                    <DialogDescription>
                        Add a new medical specialty
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="spec-name">Specialty Name *</Label>
                        <Input
                            id="spec-name"
                            value={specialtyFormData.name}
                            onChange={(e) =>
                                setSpecialtyFormData({ ...specialtyFormData, name: e.target.value })
                            }
                            placeholder="Enter specialty name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="spec-description">Description</Label>
                        <Textarea
                            id="spec-description"
                            value={specialtyFormData.description}
                            onChange={(e) =>
                                setSpecialtyFormData({ ...specialtyFormData, description: e.target.value })
                            }
                            placeholder="Enter specialty description"
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateNew}
                        disabled={!specialtyFormData.name.trim() || createSpecialtyMutation.isPending}
                    >
                        {createSpecialtyMutation.isPending ? 'Creating...' : 'Create Specialty'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
