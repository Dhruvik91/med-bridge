'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BasicInfoStep } from './steps/basic-info-step';
import { PillarSelectionStep } from './steps/pillar-selection-step';
import { RoleSelectionStep } from './steps/role-selection-step';
import { DepartmentProfileStep } from './steps/department-profile-step';
import { PreferencesStep } from './steps/preferences-step';
import { useAuth } from '@/providers/auth-provider';

interface OnboardingData {
  basicInfo?: any;
  selectedPillar?: string;
  selectedRole?: string;
  departmentProfile?: any;
  preferences?: any;
}

const STEPS = [
  { id: 'basic', title: 'Basic Information', description: 'Tell us about yourself' },
  { id: 'pillar', title: 'Choose Your Field', description: 'Select your professional area' },
  { id: 'role', title: 'Select Your Role', description: 'What position do you seek?' },
  { id: 'department', title: 'Professional Details', description: 'Share your expertise' },
  { id: 'preferences', title: 'Job Preferences', description: 'What are you looking for?' },
];

export function CandidateOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({});
  const { user } = useAuth();

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = (stepData: any) => {
    setData((prev) => ({ ...prev, ...stepData }));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'basic':
        return <BasicInfoStep onNext={handleNext} initialData={data.basicInfo} userId={user?.id || ''} />;
      case 'pillar':
        return <PillarSelectionStep onNext={handleNext} initialData={data.selectedPillar} />;
      case 'role':
        return (
          <RoleSelectionStep
            onNext={handleNext}
            pillarId={data.selectedPillar || ''}
            initialData={data.selectedRole}
          />
        );
      case 'department':
        return (
          <DepartmentProfileStep
            onNext={handleNext}
            pillarId={data.selectedPillar || ''}
            roleId={data.selectedRole || ''}
            initialData={data.departmentProfile}
          />
        );
      case 'preferences':
        return <PreferencesStep onNext={handleNext} initialData={data.preferences} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-2xl border-2">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{STEPS[currentStep].title}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {STEPS[currentStep].description}
                  </CardDescription>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  Step {currentStep + 1} of {STEPS.length}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>

            <CardContent className="pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              {currentStep > 0 && (
                <div className="mt-6">
                  <Button variant="ghost" onClick={handleBack} className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
