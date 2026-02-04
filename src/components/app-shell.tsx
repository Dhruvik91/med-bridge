'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { ToastContainer } from 'react-toastify';

import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import { Navigation } from '@/components/navigation'
import { Sidebar } from '@/components/sidebar'
import { useTheme } from 'next-themes';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface AppShellProps {
  children: ReactNode
}

// MVP app routes: dashboard, jobs, profile, applications, and saved-jobs
const APP_ROUTES_PREFIXES = [
  FRONTEND_ROUTES.DASHBOARD.BASE,
  FRONTEND_ROUTES.JOBS.BASE,
  FRONTEND_ROUTES.APPLICATIONS.BASE,
  FRONTEND_ROUTES.SAVED_JOBS,
  FRONTEND_ROUTES.PROFILE.BASE,
]

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const { theme } = useTheme()

  const isAppRoute = APP_ROUTES_PREFIXES.some((prefix) => pathname?.startsWith(prefix))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  // Authenticated users on app routes -> full app layout
  if (user && isAppRoute) {
    return (
      <div className="flex min-h-screen pb-16 lg:pb-0 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <Sidebar className="hidden lg:flex w-64 flex-col border-r fixed left-0 top-0 bottom-0 z-50" />
        <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
          <div className="lg:hidden">
            <Navigation />
          </div>
          <main className="pt-16 lg:pt-0 flex-1">
            {children}
          </main>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme === 'dark' ? 'dark' : 'light'}
          />
        </div>
        <MobileBottomNav />
      </div>
    )
  }

  // Unauthenticated users on app routes (e.g., during logout redirect)
  // Show a neutral loading state instead of public navigation to avoid flicker
  if (!user && isAppRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  // Public routes (auth, home, etc.) -> public navigation layout
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
      <div className="p-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MedBridges. All rights reserved. Healthcare Job Marketplace.</p>
      </div>
    </div>
  )
}
