interface SavedJobsHeaderProps {
    count: number;
}

export function SavedJobsHeader({ count }: SavedJobsHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Saved Jobs</h1>
            <p className="text-muted-foreground">
                {count} {count === 1 ? 'job' : 'jobs'} saved for later
            </p>
        </div>
    );
}
