import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface NoProfileAlertProps {
    message: string;
    buttonText: string;
    onButtonClick: () => void;
}

export function NoProfileAlert({ message, buttonText, onButtonClick }: NoProfileAlertProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Alert>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
            <Button className="mt-4" onClick={onButtonClick}>
                {buttonText}
            </Button>
        </div>
    );
}
