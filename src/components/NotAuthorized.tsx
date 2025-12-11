import { UserRole } from "@/types";
import { Alert, AlertDescription } from "./ui/alert";

interface INotAuthorizedProps {
    userType?: string;
}

export const NotAuthorizedUser = ({ userType }: INotAuthorizedProps) => {
    switch (userType) {
        case UserRole.employer:
            return (
                <div className="container mx-auto px-4 py-8">
                    <Alert variant="destructive">
                        <AlertDescription>
                            You don't have access to this page. Please sign in as a candidate.
                        </AlertDescription>
                    </Alert>
                </div>
            );
        case UserRole.candidate:
            return (
                <div className="container mx-auto px-4 py-8">
                    <Alert variant="destructive">
                        <AlertDescription>
                            You don't have access to this page. Please sign in as an employer.
                        </AlertDescription>
                    </Alert>
                </div>
            );
        default:
            return (
                <div className="container mx-auto px-4 py-8">
                    <Alert variant="destructive">
                        <AlertDescription>
                            You don't have access to this page. Please sign in as an employer.
                        </AlertDescription>
                    </Alert>
                </div>
            );
    }
};