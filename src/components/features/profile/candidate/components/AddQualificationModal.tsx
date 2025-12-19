'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateQualification } from '@/hooks/post/useCreateQualification';

interface AddQualificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onQualificationCreated: (qualificationId: string) => void;
}

export const AddQualificationModal = ({
    isOpen,
    onClose,
    onQualificationCreated,
}: AddQualificationModalProps) => {
    const [name, setName] = useState('');

    const createQualificationMutation = useCreateQualification({
        onSuccess: (qualification) => {
            onQualificationCreated(qualification.id);
            handleClose();
        },
    });

    const handleClose = () => {
        setName('');
        onClose();
    };

    const handleCreateNew = () => {
        if (name.trim()) {
            createQualificationMutation.mutate({
                name: name.trim(),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Qualification</DialogTitle>
                    <DialogDescription>
                        Add a new medical qualification (e.g. MBBS, MD, DM)
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="qual-name">Qualification Name *</Label>
                        <Input
                            id="qual-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter qualification name"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateNew}
                        disabled={!name.trim() || createQualificationMutation.isPending}
                    >
                        {createQualificationMutation.isPending ? 'Creating...' : 'Create Qualification'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
