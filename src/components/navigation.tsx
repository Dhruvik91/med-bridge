'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  User,
  LogOut
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { getDashboardRoute } from '@/lib/dashboard-routes'
import { UserRole } from '@/types'
import { FRONTEND_ROUTES } from '@/constants/constants'

import { CompanyLogo } from './CompanyLogo'

export function Navigation() {
  const { user, profile, signOut, loading } = useAuth()
  const logoHref = user ? getDashboardRoute(profile?.role || null) : '/'
  const pathname = usePathname()

  const getNavLinkClass = (isActive: boolean) =>
    `text-sm font-medium transition-colors ${isActive
      ? 'text-primary border-b-2 border-primary pb-1'
      : 'text-foreground/80 hover:text-primary'
    }`

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border glass-enhanced">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={logoHref}>
            <div className="relative h-24 w-40">
              <CompanyLogo />
            </div>
          </Link>

          {/* Mobile Sign Up Button (Only on Home Page when not logged in) */}
          {!user && pathname === '/' && (
            <div className="md:hidden flex items-center">
              <Link href={FRONTEND_ROUTES.AUTH.SIGNUP}>
                <Button size="sm" className="h-8 tap-scale">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center flex-1 ml-8">
            {loading ? (
              <div className="flex items-center justify-between w-full gap-4">
                <div className="flex items-center justify-center flex-1 space-x-6">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center justify-end">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center justify-between w-full gap-4">
                {/* Logged-in nav links - Role-based navigation */}
                <div className="flex items-center justify-center flex-1 space-x-6">
                  {/* Dashboard - Available to all roles */}
                  <Link
                    href={getDashboardRoute(profile?.role || null)}
                    className={getNavLinkClass(pathname === getDashboardRoute(profile?.role || null)) + " relative"}
                  >
                    Dashboard
                    {pathname === getDashboardRoute(profile?.role || null) && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>

                  {/* Jobs - Available to all roles */}
                  <Link
                    href={FRONTEND_ROUTES.JOBS.BASE}
                    className={getNavLinkClass(pathname === FRONTEND_ROUTES.JOBS.BASE) + " relative"}
                  >
                    Jobs
                    {pathname === FRONTEND_ROUTES.JOBS.BASE && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>

                  {/* Employer-specific navigation */}
                  {(profile?.role === UserRole.employer || profile?.role === UserRole.admin) && (
                    <Link
                      href={FRONTEND_ROUTES.JOBS.MANAGE}
                      className={getNavLinkClass(pathname === FRONTEND_ROUTES.JOBS.MANAGE) + " relative"}
                    >
                      Manage Jobs
                      {pathname === FRONTEND_ROUTES.JOBS.MANAGE && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  )}

                  {/* Candidate-specific navigation */}
                  {(profile?.role === UserRole.candidate || profile?.role === UserRole.admin) && (
                    <>
                      <Link
                        href={FRONTEND_ROUTES.APPLICATIONS.BASE}
                        className={getNavLinkClass(pathname === FRONTEND_ROUTES.APPLICATIONS.BASE) + " relative"}
                      >
                        Applications
                        {pathname === FRONTEND_ROUTES.APPLICATIONS.BASE && (
                          <motion.div
                            layoutId="nav-indicator"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </Link>
                      <Link
                        href={FRONTEND_ROUTES.SAVED_JOBS}
                        className={getNavLinkClass(pathname === FRONTEND_ROUTES.SAVED_JOBS) + " relative"}
                      >
                        Saved Jobs
                        {pathname === FRONTEND_ROUTES.SAVED_JOBS && (
                          <motion.div
                            layoutId="nav-indicator"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </Link>
                    </>
                  )}
                </div>

                {/* Logged-in actions (MVP: only Profile + Sign out) */}
                <div className="flex items-center justify-end space-x-4">
                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full tap-scale">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={(profile?.metadata as any)?.avatarUrl as string | undefined} alt={(profile?.metadata as any)?.name || user.email || ''} />
                          <AvatarFallback>
                            {(profile?.metadata as any)?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {(profile?.metadata as any)?.name || 'User'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                          <Badge variant="secondary" className="w-fit">
                            {profile?.role}
                          </Badge>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {/* MVP: keep Profile entry */}
                      <DropdownMenuItem asChild>
                        <Link href={FRONTEND_ROUTES.PROFILE.BASE} className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {/**
                       * MVP: hide Post Job and Settings options for now
                       *
                       * {profile?.role === 'hospital' && (
                       *   <DropdownMenuItem asChild>
                       *     <Link href="/post-job" className="flex items-center">
                       *       <Briefcase className="mr-2 h-4 w-4" />
                       *       Post Job
                       *     </Link>
                       *   </DropdownMenuItem>
                       * )}
                       * <DropdownMenuItem asChild>
                       *   <Link href="/settings" className="flex items-center">
                       *     <Settings className="mr-2 h-4 w-4" />
                       *     Settings
                       *   </Link>
                       * </DropdownMenuItem>
                       */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-end w-full gap-4">
                <div className="flex items-center space-x-2">
                  <Link href={FRONTEND_ROUTES.AUTH.LOGIN}>
                    <Button variant="ghost" className="tap-scale">Sign In</Button>
                  </Link>
                  <Link href={FRONTEND_ROUTES.AUTH.SIGNUP}>
                    <Button className="tap-scale">Get Started</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
