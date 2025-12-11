import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface EmployerProfileHeaderProps {
    companyName: string;
    onEditClick: () => void;
}

export function EmployerProfileHeader({
    companyName,
    onEditClick,
}: EmployerProfileHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                    {companyName}
                </h1>
                <p className="text-muted-foreground mt-1">
                    Healthcare Employer
                </p>
            </div>
            <Button onClick={onEditClick}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
            </Button>
        </div>
    );
}
