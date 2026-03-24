'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetJobRolesByPillar } from '@/hooks/get/useGetJobRoles';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleSelectionStepProps {
  onNext: (data: any) => void;
  pillarId: string;
  initialData?: string;
}

export function RoleSelectionStep({ onNext, pillarId, initialData }: RoleSelectionStepProps) {
  const [selectedRole, setSelectedRole] = useState<string | undefined>(initialData);
  const { data: roles, isLoading, isError } = useGetJobRolesByPillar(pillarId);

  const handleContinue = () => {
    if (selectedRole) {
      onNext({ selectedRole });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load roles. Please try again.</p>
      </div>
    );
  }

  if (!roles || roles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No roles available for this pillar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {roles.map((role) => (
          <Card
            key={role.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              selectedRole === role.id
                ? 'border-2 border-primary bg-primary/5'
                : 'border hover:border-primary/50'
            )}
            onClick={() => setSelectedRole(role.id)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{role.name}</h3>
                {role.description && (
                  <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                )}
              </div>
              {selectedRole === role.id && (
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 ml-4" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selectedRole}
        className="w-full"
        size="lg"
      >
        Continue
      </Button>
    </div>
  );
}
