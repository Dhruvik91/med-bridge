'use client'

import Link from 'next/link'
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
  Stethoscope, 
  User, 
  Settings, 
  LogOut,
  Briefcase,
  MessageSquare,
  Bell
} from 'lucide-react'
import { getDashboardRoute } from '@/lib/dashboard-routes'

export function Navigation() {
  const { user, profile, signOut } = useAuth()
  const logoHref = user ? getDashboardRoute(profile?.role || null) : '/'

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={logoHref} className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MedBridge</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-8">
            {user ? (
              <>
                {/* Logged-in nav links (MVP: only Jobs) */}
                <div className="flex items-center space-x-6">
                  <Link href="/jobs" className="text-foreground hover:text-primary transition-colors">
                    Jobs
                  </Link>
                  {/**
                   * MVP: hide Doctors and Hospitals navigation links for now
                   *
                   * <Link href="/doctors" className="text-foreground hover:text-primary transition-colors">
                   *   Doctors
                   * </Link>
                   * <Link href="/hospitals" className="text-foreground hover:text-primary transition-colors">
                   *   Hospitals
                   * </Link>
                   */}
                </div>

                {/* Logged-in actions (MVP: only Profile + Sign out) */}
                <div className="flex items-center space-x-4">
                  {/**
                   * MVP: hide Notifications and Messages for now
                   *
                   * <Button variant="ghost" size="sm" className="relative">
                   *   <Bell className="h-5 w-5" />
                   *   <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                   *     3
                   *   </Badge>
                   * </Button>
                   *
                   * <Link href="/messages">
                   *   <Button variant="ghost" size="sm">
                   *     <MessageSquare className="h-5 w-5" />
                   *   </Button>
                   * </Link>
                   */}

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={undefined} alt={profile?.name || user.email || ''} />
                          <AvatarFallback>
                            {profile?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {profile?.name || 'User'}
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
                        <Link href="/profile" className="flex items-center">
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
              </>
            ) : (
              <>
                {/* General (logged-out) nav links */}
                <div className="flex items-center space-x-6">
                  <Link href="/doctors" className="text-foreground hover:text-primary transition-colors">
                    Doctors
                  </Link>
                  <Link href="/hospitals" className="text-foreground hover:text-primary transition-colors">
                    Hospitals
                  </Link>
                </div>

                {/* Auth actions */}
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
