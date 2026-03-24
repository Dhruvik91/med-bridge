'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetPillars } from '@/hooks/get/useGetPillars';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Pillar } from '@/types';

interface PillarSelectionStepProps {
  onNext: (data: any) => void;
  initialData?: string;
}

export function PillarSelectionStep({ onNext, initialData }: PillarSelectionStepProps) {
  const [selectedPillar, setSelectedPillar] = useState<string | undefined>(initialData);
  const { data: pillarsData, isLoading, isError } = useGetPillars();

  const handleContinue = () => {
    if (selectedPillar) {
      onNext({ selectedPillar });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load pillars. Please try again.</p>
      </div>
    );
  }

  const pillars = pillarsData?.items || [];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {pillars.map((pillar) => (
          <Card
            key={pillar.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              selectedPillar === pillar.id
                ? 'border-2 border-primary bg-primary/5'
                : 'border hover:border-primary/50'
            )}
            onClick={() => setSelectedPillar(pillar.id)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{pillar.name}</h3>
                {pillar.description && (
                  <p className="text-sm text-muted-foreground mt-1">{pillar.description}</p>
                )}
              </div>
              {selectedPillar === pillar.id && (
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 ml-4" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selectedPillar}
        className="w-full"
        size="lg"
      >
        Continue
      </Button>
    </div>
  );
}
