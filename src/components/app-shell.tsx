'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'

interface AppShellProps {
  children: ReactNode
}

// MVP app routes: dashboard, jobs, and profile
const APP_ROUTES_PREFIXES = [
  '/dashboard',
  '/jobs',
  '/profile',
  // '/messages',
  // '/settings',
  // '/post-job',
]

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const isAppRoute = APP_ROUTES_PREFIXES.some((prefix) => pathname?.startsWith(prefix))

  if (user && isAppRoute) {
    return (
      <div className="min-h-screen pb-16 md:pb-0">
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
