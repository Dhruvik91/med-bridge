import { UserCircle, Building2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserRole } from '@/types';

interface RoleSelectorProps {
    selectedRole: UserRole.candidate | UserRole.employer;
    onRoleChange: (role: UserRole.candidate | UserRole.employer) => void;
}

export function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
    return (
        <div className="space-y-3">
            <Label>I am a</Label>
            <RadioGroup
                value={selectedRole}
                onValueChange={(value) => onRoleChange(value as UserRole.candidate | UserRole.employer)}
                className="grid grid-cols-2 gap-4"
            >
                <div>
                    <RadioGroupItem
                        value="candidate"
                        id="candidate"
                        className="peer sr-only"
                    />
                    <Label
                        htmlFor="candidate"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                        <UserCircle className="mb-3 h-6 w-6" aria-hidden="true" />
                        <span className="text-sm font-medium">Doctor</span>
                    </Label>
                </div>
                <div>
                    <RadioGroupItem
                        value="employer"
                        id="employer"
                        className="peer sr-only"
                    />
                    <Label
                        htmlFor="employer"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                        <Building2 className="mb-3 h-6 w-6" aria-hidden="true" />
                        <span className="text-sm font-medium">Employer</span>
                    </Label>
                </div>
            </RadioGroup>
        </div>
    );
}
