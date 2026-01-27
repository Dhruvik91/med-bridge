import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    stepLabels: string[];
}

export const ProgressIndicator = ({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) => {
    return (
        <Card className="mb-6 overflow-hidden">
            <CardContent className="pt-8 pb-6">
                <div className="relative max-w-2xl mx-auto">
                    {/* Progress Line Background */}
                    <div className="absolute top-5 left-0 w-full h-0.5 bg-muted -translate-y-1/2" />

                    {/* Active Progress Line */}
                    <div
                        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out -translate-y-1/2"
                        style={{
                            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
                        }}
                    />

                    {/* Steps */}
                    <div className="relative flex justify-between items-start px-2">
                        {stepLabels.map((label, index) => {
                            const stepNumber = index + 1;
                            const isActive = stepNumber === currentStep;
                            const isCompleted = stepNumber < currentStep;

                            return (
                                <div key={stepNumber} className="flex flex-col items-center z-10">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300",
                                            isCompleted
                                                ? "bg-primary text-primary-foreground"
                                                : isActive
                                                    ? "bg-background border-2 border-primary text-primary ring-4 ring-primary/10"
                                                    : "bg-background border-2 border-muted text-muted-foreground"
                                        )}
                                    >
                                        {stepNumber}
                                    </div>
                                    <div className="mt-3 text-center">
                                        <span
                                            className={cn(
                                                "text-xs sm:text-sm font-medium transition-colors duration-300 block",
                                                isActive ? "text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            {label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
