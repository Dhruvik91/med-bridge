'use client'

import { ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface AppShellProps {
  children: ReactNode
}

// MVP app routes: dashboard, jobs, profile, applications, and saved-jobs
const APP_ROUTES_PREFIXES = [
  '/dashboard',
  '/jobs',
  '/profile',
  '/applications',
  '/saved-jobs',
  // '/messages',
  // '/settings',
  // '/post-job',
]

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const isAppRoute = APP_ROUTES_PREFIXES.some((prefix) => pathname?.startsWith(prefix))

  // Don't show back button on main dashboard pages
  const isDashboardHome = pathname === '/dashboard' || 
                          pathname === '/dashboard/candidate' || 
                          pathname === '/dashboard/employer'

  const handleBack = () => {
    router.back()
  }

  if (user && isAppRoute) {
    return (
      <div className="min-h-screen pb-16 md:pb-0">
        {/* Global Back Button */}
        {!isDashboardHome && (
          <div className="fixed top-4 left-4 z-40">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        )}
        {children}
        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {children}
      <div className="p-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MedBridge. All rights reserved. Healthcare Job Marketplace.</p>
      </div>
    </div>
  )
}
