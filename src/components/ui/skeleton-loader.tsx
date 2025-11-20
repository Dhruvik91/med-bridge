import { cn } from "@/lib/utils"

interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SkeletonLoader({ className, ...props }: SkeletonLoaderProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50",
        className
      )}
      role="status"
      aria-label="Loading content"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4" role="status" aria-label="Loading card">
      <SkeletonLoader className="h-4 w-3/4" />
      <SkeletonLoader className="h-4 w-1/2" />
      <SkeletonLoader className="h-20 w-full" />
      <SkeletonLoader className="h-4 w-1/4" />
    </div>
  )
}