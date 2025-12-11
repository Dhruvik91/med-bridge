import { Card, CardContent } from '@/components/ui/card';

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    stepLabels: string[];
}

export const ProgressIndicator = ({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) => {
    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    {stepLabels.map((label, index) => {
                        const stepNumber = index + 1;
                        const isActive = stepNumber === currentStep;
                        const isCompleted = stepNumber < currentStep;

                        return (
                            <div key={stepNumber} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${isCompleted
                                                ? 'bg-primary text-primary-foreground'
                                                : isActive
                                                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                                                    : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {stepNumber}
                                    </div>
                                    <span
                                        className={`mt-2 text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'
                                            }`}
                                    >
                                        {label}
                                    </span>
                                </div>
                                {stepNumber < totalSteps && (
                                    <div
                                        className={`h-1 flex-1 mx-2 transition-colors ${isCompleted ? 'bg-primary' : 'bg-muted'
                                            }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
