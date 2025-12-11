import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign } from 'lucide-react';

interface JobDetailContentProps {
    salary: string;
    applicationDeadline?: string;
    maxApplications?: number;
    specialties?: Array<{ id: string; name: string }>;
    description: string;
    requirements?: string | string[];
    responsibilities?: string[];
    perks?: string[];
    benefits?: string;
}

export const JobDetailContent = ({
    salary,
    applicationDeadline,
    maxApplications,
    specialties,
    description,
    requirements,
    responsibilities,
    perks,
    benefits,
}: JobDetailContentProps) => {
    return (
        <div className="space-y-6">
            {/* Salary */}
            <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
                    Salary
                </h3>
                <p className="text-lg">{salary}</p>
            </div>

            {/* Application Deadline & Max Applications */}
            {(applicationDeadline || maxApplications) && (
                <>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {applicationDeadline && (
                            <div>
                                <h3 className="font-semibold mb-2">Application Deadline</h3>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(applicationDeadline).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        )}
                        {maxApplications && (
                            <div>
                                <h3 className="font-semibold mb-2">Max Applications</h3>
                                <p className="text-sm text-muted-foreground">{maxApplications}</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            <Separator />

            {/* Specialties */}
            {specialties && specialties.length > 0 && (
                <>
                    <div>
                        <h3 className="font-semibold mb-3">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                            {specialties.map((specialty) => (
                                <Badge key={specialty.id} variant="secondary">
                                    {specialty.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <Separator />
                </>
            )}

            {/* Description */}
            <div>
                <h3 className="font-semibold mb-3">Job Description</h3>
                <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{description}</p>
                </div>
            </div>

            {/* Requirements */}
            {requirements && (Array.isArray(requirements) ? requirements.length > 0 : requirements) && (
                <>
                    <Separator />
                    <div>
                        <h3 className="font-semibold mb-3">Requirements</h3>
                        {Array.isArray(requirements) ? (
                            <ul className="list-disc list-inside space-y-2">
                                {requirements.map((req, index) => (
                                    <li key={index} className="text-sm">{req}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="prose prose-sm max-w-none">
                                <p className="whitespace-pre-wrap">{requirements}</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Responsibilities */}
            {responsibilities && Array.isArray(responsibilities) && responsibilities.length > 0 && (
                <>
                    <Separator />
                    <div>
                        <h3 className="font-semibold mb-3">Responsibilities</h3>
                        <ul className="list-disc list-inside space-y-2">
                            {responsibilities.map((resp, index) => (
                                <li key={index} className="text-sm">{resp}</li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            {/* Perks */}
            {perks && Array.isArray(perks) && perks.length > 0 && (
                <>
                    <Separator />
                    <div>
                        <h3 className="font-semibold mb-3">Perks</h3>
                        <ul className="list-disc list-inside space-y-2">
                            {perks.map((perk, index) => (
                                <li key={index} className="text-sm">{perk}</li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            {/* Benefits */}
            {benefits && (
                <>
                    <Separator />
                    <div>
                        <h3 className="font-semibold mb-3">Benefits</h3>
                        <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-wrap">{benefits}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
