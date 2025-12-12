import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { Specialty } from '@/types';
import { Plus, X } from 'lucide-react';

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
}

export function ProfessionalDetailsStep({ register, errors, watch, specialties, selectedSpecialties, onAddSpecialty, onRemoveSpecialty, socialLinks, onSocialLinksChange, onAvatarFileSelected, onResumeFileSelected, avatarUploading, resumeUploading }: ProfessionalDetailsStepProps) {
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
                <Label htmlFor="qualificationsRaw">Qualifications</Label>
                <Input
                    id="qualificationsRaw"
                    placeholder="e.g. MBBS, MD, DM"
                    {...register('qualificationsRaw')}
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
                                defaultValue={socialLinks.linkedin || ''}
                                onBlur={(e) => {
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
                            />
                            <Input
                                placeholder="https://..."
                                id="socialUrlTemp"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    const labelInput = document.getElementById('socialLabelTemp') as HTMLInputElement | null;
                                    const urlInput = document.getElementById('socialUrlTemp') as HTMLInputElement | null;
                                    const label = labelInput?.value.trim();
                                    const url = urlInput?.value.trim();
                                    if (!label || !url) return;
                                    const next = { ...socialLinks };
                                    next[label] = url;
                                    onSocialLinksChange(next);
                                    if (labelInput) labelInput.value = '';
                                    if (urlInput) urlInput.value = '';
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
                <Label htmlFor="specialtiesSelect">Specialties</Label>
                <div className="flex gap-2">
                    <select
                        id="specialtiesSelect"
                        className="border rounded px-2 py-1 flex-1 bg-background"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value) {
                                onAddSpecialty(value);
                                e.target.value = '';
                            }
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select a specialty
                        </option>
                        {availableSpecialties.map((spec) => (
                            <option key={spec.id} value={spec.id}>
                                {spec.name}
                            </option>
                        ))}
                    </select>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            const select = document.getElementById('specialtiesSelect') as HTMLSelectElement | null;
                            if (!select) return;
                            const value = select.value;
                            if (value) {
                                onAddSpecialty(value);
                                select.value = '';
                            }
                        }}
                    >
                        Add
                    </Button>
                </div>
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
        </>
    );
}
