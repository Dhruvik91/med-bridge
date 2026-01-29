import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { Specialty, Qualification } from '@/types';
import { Plus, X } from 'lucide-react';
import { AddSpecialtyModal } from './AddSpecialtyModal';
import { QualificationSelector } from './QualificationSelector';
import { AddQualificationModal } from './AddQualificationModal';
import { SearchableSelect } from './SearchableSelect';

interface ProfessionalDetailsStepProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    watch: UseFormWatch<any>;
    specialties: Specialty[];
    selectedSpecialties: Specialty[];
    onAddSpecialty: (specialtyId: string) => void;
    onRemoveSpecialty: (specialtyId: string) => void;
    socialLinks: Record<string, string>;
    onSocialLinksChange: (links: Record<string, string>) => void;
    onAvatarFileSelected: (file: File | null) => void;
    onResumeFileSelected: (file: File | null) => void;
    avatarUploading: boolean;
    resumeUploading: boolean;
    // Modal props
    isModalOpen: boolean;
    onOpenModal: () => void;
    onCloseModal: () => void;
    // Qualification props
    qualifications: Qualification[];
    selectedQualifications: Qualification[];
    onAddQualification: (qualificationId: string) => void;
    onRemoveQualification: (qualificationId: string) => void;
    isQualModalOpen: boolean;
    onOpenQualModal: () => void;
    onCloseQualModal: () => void;
}

import { useState } from 'react';

export function ProfessionalDetailsStep({ register, errors, watch, specialties, selectedSpecialties, onAddSpecialty, onRemoveSpecialty, socialLinks, onSocialLinksChange, onAvatarFileSelected, onResumeFileSelected, avatarUploading, resumeUploading, isModalOpen, onOpenModal, onCloseModal, qualifications, selectedQualifications, onAddQualification, onRemoveQualification, isQualModalOpen, onOpenQualModal, onCloseQualModal }: ProfessionalDetailsStepProps) {
    const [newLinkLabel, setNewLinkLabel] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');

    const availableSpecialties = specialties.filter(
        (spec) => !selectedSpecialties.some((selected) => selected.id === spec.id)
    );

    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="licenseNumber">Medical License Number *</Label>
                <Input
                    id="licenseNumber"
                    {...register('licenseNumber')}
                    aria-invalid={!!errors.licenseNumber}
                />
                {errors.licenseNumber && (
                    <p className="text-sm text-destructive">{errors.licenseNumber.message as string}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                <Input
                    id="yearsOfExperience"
                    type="number"
                    min="0"
                    {...register('yearsOfExperience')}
                    aria-invalid={!!errors.yearsOfExperience}
                />
                {errors.yearsOfExperience && (
                    <p className="text-sm text-destructive">{errors.yearsOfExperience.message as string}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                    id="bio"
                    rows={5}
                    placeholder="Tell employers about your experience, specializations, and career goals..."
                    {...register('bio')}
                    aria-invalid={!!errors.bio}
                />
                <p className="text-xs text-muted-foreground">
                    {watch('bio')?.length || 0}/500 characters
                </p>
                {errors.bio && (
                    <p className="text-sm text-destructive">{errors.bio.message as string}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Qualifications</Label>
                <QualificationSelector
                    availableQualifications={qualifications}
                    selectedQualifications={selectedQualifications}
                    onAddQualification={onAddQualification}
                    onRemoveQualification={onRemoveQualification}
                    onCreateNew={onOpenQualModal}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="avatarFile">Profile Photo</Label>
                <Input
                    id="avatarFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onAvatarFileSelected(file);
                    }}
                />
                {avatarUploading && (
                    <p className="text-xs text-muted-foreground">Uploading profile photo...</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="resumeFile">Resume</Label>
                <Input
                    id="resumeFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onResumeFileSelected(file);
                    }}
                />
                {resumeUploading && (
                    <p className="text-xs text-muted-foreground">Uploading resume...</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Social Links</Label>
                <div className="space-y-2">
                    <div className="grid md:grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">LinkedIn</span>
                            <Input
                                placeholder="https://linkedin.com/in/your-profile"
                                value={socialLinks.linkedin || ''}
                                onChange={(e) => {
                                    const value = e.target.value.trim();
                                    const next = { ...socialLinks };
                                    if (value) {
                                        next.linkedin = value;
                                    } else {
                                        delete next.linkedin;
                                    }
                                    onSocialLinksChange(next);
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">Other social links</span>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Label (e.g. Portfolio)"
                                id="socialLabelTemp"
                                value={newLinkLabel}
                                onChange={(e) => setNewLinkLabel(e.target.value)}
                            />
                            <Input
                                placeholder="https://..."
                                id="socialUrlTemp"
                                value={newLinkUrl}
                                onChange={(e) => setNewLinkUrl(e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    const label = newLinkLabel.trim();
                                    const url = newLinkUrl.trim();
                                    if (!label || !url) return;
                                    const next = { ...socialLinks };
                                    next[label] = url;
                                    onSocialLinksChange(next);
                                    setNewLinkLabel('');
                                    setNewLinkUrl('');
                                }}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {Object.keys(socialLinks).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(socialLinks).map(([key, value]) => (
                                <Badge key={key} variant="secondary" className="text-xs flex items-center gap-1">
                                    <span>{key}</span>
                                    <button
                                        type="button"
                                        className="ml-1 hover:text-destructive"
                                        onClick={() => {
                                            const next = { ...socialLinks };
                                            delete next[key];
                                            onSocialLinksChange(next);
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Specialties</Label>
                <SearchableSelect
                    items={availableSpecialties}
                    onSelect={onAddSpecialty}
                    onOthersClick={onOpenModal}
                    placeholder="Select a specialty"
                    noResultsMessage="No specialty found."
                />
                {selectedSpecialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSpecialties.map((spec) => (
                            <Badge key={spec.id} variant="secondary" className="text-sm">
                                {spec.name}
                                <button
                                    type="button"
                                    onClick={() => onRemoveSpecialty(spec.id)}
                                    className="ml-2 hover:text-destructive"
                                    aria-label={`Remove ${spec.name}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <AddSpecialtyModal
                isOpen={isModalOpen}
                onClose={onCloseModal}
                onSpecialtyCreated={onAddSpecialty}
            />

            <AddQualificationModal
                isOpen={isQualModalOpen}
                onClose={onCloseQualModal}
                onQualificationCreated={onAddQualification}
            />
        </>
    );
}
