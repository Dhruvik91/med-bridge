import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginHeader() {
    return (
        <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
                Sign in to your MedBridges account
            </CardDescription>
        </CardHeader>
    );
}
