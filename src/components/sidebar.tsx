'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Stethoscope,
    Home,
    Briefcase,
    BookmarkCheck,
    User,
    Building2,
    PlusCircle,
    LogOut,
    LucideIcon
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FRONTEND_ROUTES } from '@/constants/constants'
import { UserRole } from '@/types'
import { getDashboardRoute } from '@/lib/dashboard-routes'

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
        icon: BookmarkCheck,
    },
    {
        href: FRONTEND_ROUTES.SAVED_JOBS,
        label: "Saved Jobs",
        icon: BookmarkCheck,
    },
    {
        href: FRONTEND_ROUTES.PROFILE.BASE,
        label: "Profile",
        icon: User,
    },
]

const getEmployerNavItems = (): NavItem[] => [
    {
        href: FRONTEND_ROUTES.DASHBOARD.EMPLOYER,
        label: "Home",
        icon: Home,
    },
    {
        href: FRONTEND_ROUTES.JOBS.MANAGE,
        label: "Manage Jobs",
        icon: Briefcase,
    },
    {
        href: FRONTEND_ROUTES.JOBS.CREATE,
        label: "Post Job",
        icon: PlusCircle,
    },
    {
        href: FRONTEND_ROUTES.PROFILE.BASE,
        label: "Profile",
        icon: Building2,
    },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className, ...props }: SidebarProps) {
    const pathname = usePathname()
    const { user, profile, signOut, loading } = useAuth()

    if (loading || !user) return null

    const getNavItems = () => {
        const role = user.role
        if (role === UserRole.candidate) return getCandidateNavItems()
        if (role === UserRole.employer) return getEmployerNavItems()
        return getCandidateNavItems()
    }

    const items = getNavItems()
    const dashboardRoute = getDashboardRoute(profile?.role || null)

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <div className={cn("flex flex-col h-full bg-background border-r border-border", className)} {...props}>
            <div className="p-6">
                <Link href={dashboardRoute} className="flex items-center space-x-2">
                    <Stethoscope className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold">MedBridge</span>
                </Link>
            </div>

            <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={(profile?.metadata as any)?.avatarUrl} />
                                    <AvatarFallback>{(profile?.metadata as any)?.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start text-left overflow-hidden flex-1">
                                    <span className="text-sm font-medium truncate w-full">{(profile?.metadata as any)?.name || 'User'}</span>
                                    <span className="text-xs text-muted-foreground truncate w-full">{user.email}</span>
                                </div>
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
                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
