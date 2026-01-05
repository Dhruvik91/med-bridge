interface AdminCandidatesPageHeaderProps {
  title: string;
  description: string;
}

export function AdminCandidatesPageHeader({
  title,
  description,
}: AdminCandidatesPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
