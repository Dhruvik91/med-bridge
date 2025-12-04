'use client'

import { ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Sidebar } from '@/components/sidebar'

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
      <div className="flex min-h-screen pb-16 md:pb-0">
        <Sidebar className="hidden md:flex w-64 flex-col border-r fixed left-0 top-0 bottom-0 z-50" />
        <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
          <div className="md:hidden">
            <Navigation />
          </div>
          <main className="pt-16 md:pt-0 flex-1">
            {children}
          </main>
        </div>
        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
      <div className="p-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MedBridge. All rights reserved. Healthcare Job Marketplace.</p>
      </div>
    </div>
  )
}
