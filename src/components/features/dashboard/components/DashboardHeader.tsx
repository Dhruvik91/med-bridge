interface DashboardHeaderProps {
    displayName?: string;
    fullName?: string;
    title?: string;
    description?: string;
}

export function DashboardHeader({ displayName, fullName, title, description }: DashboardHeaderProps) {
    // If title is provided, use it (employer dashboard)
    if (title) {
        return (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Otherwise use candidate dashboard style
    const firstName = fullName?.split(' ')[0];
    const greeting = displayName ? `, ${displayName}` : firstName ? `, ${firstName}` : '';

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                    Welcome {greeting}!
                </h1>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">
                    Here's your job search overview
                </p>
            </div>
        </div>
    );
}

