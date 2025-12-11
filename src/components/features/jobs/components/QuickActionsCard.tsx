import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickActionsCardProps {
    hasApplied: boolean;
    isSaved: boolean;
    onApply: () => void;
    onSave: () => void;
    isSaving: boolean;
}

export const QuickActionsCard = ({
    hasApplied,
    isSaved,
    onApply,
    onSave,
    isSaving,
}: QuickActionsCardProps) => {
    return (
        <Card className="sticky top-4">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!hasApplied && (
                    <Button
                        onClick={onApply}
                        variant="outline"
                        className="w-full"
                        size="lg"
                    >
                        Go to Application
                    </Button>
                )}
                <Button
                    onClick={onSave}
                    variant="outline"
                    className="w-full"
                    disabled={isSaving}
                >
                    {isSaved ? 'Saved' : 'Save for Later'}
                </Button>
            </CardContent>
        </Card>
    );
};
