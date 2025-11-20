import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 pt-16 cv-auto overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="bg-blur-shape bg-blur-shape-1"></div>
        <div className="bg-blur-shape bg-blur-shape-2"></div>
        <div className="bg-blur-shape bg-blur-shape-3"></div>
        <div className="bg-blur-shape bg-blur-shape-4"></div>
      </div>
      
      {/* Gradient Mesh Overlay */}
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-xl text-balance text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It may have been moved or no longer exists.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  )
}
