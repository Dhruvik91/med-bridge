'use client'

import { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Home,
    Briefcase,
    BookmarkCheck,
    User,
    LogOut,
    LucideIcon,
    File,
    Users, FileText, Building2, LayoutDashboard, UserCheck,
    Mail
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { COMPANY_EMAIL, FRONTEND_ROUTES } from '@/constants/constants'
import { UserRole } from '@/types'

import { getDashboardRoute } from '@/lib/dashboard-routes'
import { SignOutConfirmationModal } from '@/components/features/profile/components/SignOutConfirmationModal'
import { useGetDoctorProfile } from '@/hooks/get/useGetDoctorProfile'
import { useGetEmployerProfile } from '@/hooks/get/useGetEmployerProfile'

import { CompanyLogo } from './CompanyLogo'

type NavItem = {
    href: string
    label: string
    icon: LucideIcon
}

const getCandidateNavItems = (): NavItem[] => [
    {
        href: FRONTEND_ROUTES.DASHBOARD.CANDIDATE,
        label: "Home",
        icon: Home,
    },
    {
        href: FRONTEND_ROUTES.JOBS.BASE,
        label: "Jobs",
        icon: Briefcase,
    },
    {
        href: FRONTEND_ROUTES.APPLICATIONS.BASE,
        label: "Applications",
        icon: File,
    },
    {
        href: FRONTEND_ROUTES.SAVED_JOBS,
        label: "Saved Jobs",
        icon: BookmarkCheck,
    },
]

const getEmployerNavItems = (): NavItem[] => [
    {
        href: FRONTEND_ROUTES.DASHBOARD.EMPLOYER,
        label: "Home",
        icon: Home,
    },
    {
        href: FRONTEND_ROUTES.APPLICATIONS.MANAGE,
        label: "Applications",
        icon: File,
    },
    {
        href: FRONTEND_ROUTES.JOBS.MANAGE,
        label: "Manage Jobs",
        icon: Briefcase,
    },
]

const getAdminNavItems = (): NavItem[] => [
    {
        href: FRONTEND_ROUTES.ADMIN.BASE,
        label: 'Dashboard',
        icon: LayoutDashboard,
    },
    {
        href: FRONTEND_ROUTES.ADMIN.USERS,
        label: 'Users',
        icon: Users,
    },
    {
        href: FRONTEND_ROUTES.ADMIN.CANDIDATES,
        label: 'Candidates',
        icon: UserCheck,
    },
    {
        href: FRONTEND_ROUTES.ADMIN.EMPLOYERS,
        label: 'Employers',
        icon: Building2,
    },
    {
        href: FRONTEND_ROUTES.ADMIN.JOBS,
        label: 'Jobs',
        icon: Briefcase,
    },
    {
        href: FRONTEND_ROUTES.ADMIN.APPLICATIONS,
        label: 'Applications',
        icon: FileText,
    },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

const getNavItems = (role: UserRole) => {
    switch (role) {
        case UserRole.candidate:
            return getCandidateNavItems()
        case UserRole.employer:
            return getEmployerNavItems()
        case UserRole.admin:
            return getAdminNavItems()
        default:
            return getCandidateNavItems()
    }
}

export function Sidebar({ className, ...props }: SidebarProps) {
    const pathname = usePathname()
    const { user, profile, signOut, loading } = useAuth()
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)

    // Fetch profile data based on user role
    const { data: doctorProfile, isLoading: isDoctorProfileLoading } = useGetDoctorProfile(
        user?.role === UserRole.candidate ? user.id : ''
    )

    // For employer profile, we need to check if we should fetch it
    const shouldFetchEmployerProfile = user?.role === UserRole.employer
    const { data: employerProfile, isLoading: isEmployerProfileLoading } = useGetEmployerProfile(
        shouldFetchEmployerProfile ? { ...user, isEmailVerified: true, isGoogleSignup: false, createdAt: '', updatedAt: '' } : undefined
    )

    if (loading || !user) return null

    const isProfileCompletionPage =
        pathname?.startsWith(FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE) ||
        pathname?.startsWith(FRONTEND_ROUTES.PROFILE.EMPLOYER.COMPLETE)

    if (isProfileCompletionPage) return null

    const items = getNavItems(user.role)
    const dashboardRoute = getDashboardRoute(profile?.role || null)

    // Determine profile data based on role
    const isProfileLoading = isDoctorProfileLoading || isEmployerProfileLoading
    const avatarUrl = user.role === UserRole.candidate
        ? doctorProfile?.avatarUrl
        : user.role === UserRole.employer
            ? employerProfile?.logoUrl
            : null

    const displayName = user.role === UserRole.candidate
        ? (doctorProfile?.displayName || doctorProfile?.fullName)
        : user.role === UserRole.employer
            ? employerProfile?.name
            : null

    const handleSignOutClick = () => {
        setIsSignOutModalOpen(true)
    }

    const handleConfirmSignOut = async () => {
        try {
            await signOut()
            setIsSignOutModalOpen(false)
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <div className={cn("flex flex-col h-full bg-background border-r border-border glass-enhanced", className)} {...props}>
            <div className="">
                <Link href={dashboardRoute} className="flex items-center justify-center">
                    <div className="relative h-24">
                        <CompanyLogo />
                    </div>
                </Link>
            </div>

            <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-border">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start px-2 hover:bg-accent h-auto py-2">
                            <div className="flex items-center space-x-3 w-full">
                                {isProfileLoading ? (
                                    <>
                                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                                        <div className="flex flex-col items-start text-left overflow-hidden flex-1 space-y-1">
                                            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={avatarUrl || (profile?.metadata as any)?.avatarUrl} />
                                            <AvatarFallback>
                                                {(displayName || (profile?.metadata as any)?.name || user.email || '')
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start text-left overflow-hidden flex-1">
                                            <span className="text-sm font-medium truncate w-full">
                                                {displayName || (profile?.metadata as any)?.name || 'User'}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate w-full">{user.email}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={FRONTEND_ROUTES.PROFILE.BASE} className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href={`mailto:${COMPANY_EMAIL}`} className="cursor-pointer w-full">
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Feedback</span>
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignOutClick} className="cursor-pointer text-destructive focus:text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <SignOutConfirmationModal
                isOpen={isSignOutModalOpen}
                onClose={() => setIsSignOutModalOpen(false)}
                onConfirm={handleConfirmSignOut}
            />
        </div>
    )
}
