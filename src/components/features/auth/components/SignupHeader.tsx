import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function SignupHeader() {
    return (
        <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
            <CardDescription className="text-center">
                Join MedBridges to find your next opportunity
            </CardDescription>
        </CardHeader>
    );
}
