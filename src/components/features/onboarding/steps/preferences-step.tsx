'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface PreferencesStepProps {
  onNext: (data: any) => void;
  initialData?: any;
}

export function PreferencesStep({ onNext, initialData }: PreferencesStepProps) {
  const router = useRouter();
  const [locations, setLocations] = useState<string[]>(initialData?.preferredLocations || []);
  const [currentLocation, setCurrentLocation] = useState('');
  const [willingToRelocate, setWillingToRelocate] = useState(initialData?.willingToRelocate || false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: initialData,
  });

  const addLocation = () => {
    if (currentLocation.trim() && !locations.includes(currentLocation.trim())) {
      setLocations([...locations, currentLocation.trim()]);
      setCurrentLocation('');
    }
  };

  const removeLocation = (location: string) => {
    setLocations(locations.filter((l) => l !== location));
  };

  const onSubmit = async (data: any) => {
    onNext({
      preferences: {
        ...data,
        preferredLocations: locations,
        willingToRelocate,
      },
    });
    router.push(FRONTEND_ROUTES.DASHBOARD.CANDIDATE);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="preferredLocations">Preferred Locations</Label>
        <div className="flex gap-2">
          <Input
            id="preferredLocations"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addLocation();
              }
            }}
            placeholder="Add a city and press Enter"
          />
          <Button type="button" onClick={addLocation} variant="secondary">
            Add
          </Button>
        </div>
        {locations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {locations.map((location) => (
              <Badge key={location} variant="secondary" className="gap-1 pr-1">
                {location}
                <button
                  type="button"
                  onClick={() => removeLocation(location)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expectedSalaryMin">Expected Salary (Min)</Label>
          <Input
            id="expectedSalaryMin"
            type="number"
            {...register('expectedSalaryMin')}
            placeholder="50000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedSalaryMax">Expected Salary (Max)</Label>
          <Input
            id="expectedSalaryMax"
            type="number"
            {...register('expectedSalaryMax')}
            placeholder="80000"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="willingToRelocate"
          checked={willingToRelocate}
          onCheckedChange={(checked) => setWillingToRelocate(checked as boolean)}
        />
        <Label
          htmlFor="willingToRelocate"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          I am willing to relocate for the right opportunity
        </Label>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Completing...' : 'Complete Onboarding'}
      </Button>
    </form>
  );
}
