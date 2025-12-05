interface DashboardHeaderProps {
    displayName?: string;
    fullName?: string;
}

export function DashboardHeader({ displayName, fullName }: DashboardHeaderProps) {
    const firstName = fullName?.split(' ')[0];
    const greeting = displayName ? `, ${displayName}` : firstName ? `, ${firstName}` : '';

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                    Welcome back{greeting}!
                </h1>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                    Here's your job search overview
                </p>
            </div>
        </div>
    );
}
