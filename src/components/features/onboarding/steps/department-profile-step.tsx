'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';

interface DepartmentProfileStepProps {
  onNext: (data: any) => void;
  pillarId: string;
  roleId: string;
  initialData?: any;
}

export function DepartmentProfileStep({ onNext, pillarId, roleId, initialData }: DepartmentProfileStepProps) {
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [currentSkill, setCurrentSkill] = useState('');

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: initialData,
  });

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const onSubmit = async (data: any) => {
    onNext({ departmentProfile: { ...data, skills } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="experienceYears">Years of Experience in This Role</Label>
        <Input
          id="experienceYears"
          type="number"
          min="0"
          max="50"
          {...register('experienceYears')}
          placeholder="5"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications (Optional)</Label>
        <Input
          id="certifications"
          {...register('certifications')}
          placeholder="e.g., Board Certified, Licensed Professional"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Key Skills</Label>
        <div className="flex gap-2">
          <Input
            id="skills"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill and press Enter"
          />
          <Button type="button" onClick={addSkill} variant="secondary">
            Add
          </Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Continue'}
      </Button>
    </form>
  );
}
