"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, User, Home, Building2, BookmarkCheck, PlusCircle, LucideIcon, File } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"
import { UserRole } from "@/types"
import { FRONTEND_ROUTES } from "@/constants/constants"

// Navigation item type
type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

// Role-based navigation items
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
    label: "Saved",
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
    href: FRONTEND_ROUTES.APPLICATIONS.MANAGE,
    label: "Applications",
    icon: File,
  },
  {
    href: FRONTEND_ROUTES.JOBS.CREATE,
    label: "Post Job",
    icon: PlusCircle,
  },
  {
    href: FRONTEND_ROUTES.JOBS.MANAGE,
    label: "Manage",
    icon: Briefcase,
  },
  {
    href: FRONTEND_ROUTES.PROFILE.BASE,
    label: "Profile",
    icon: Building2,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  if (loading || !user) {
    return null
  }

  const isProfileCompletionPage =
    pathname?.startsWith(FRONTEND_ROUTES.PROFILE.DOCTOR.COMPLETE) ||
    pathname?.startsWith(FRONTEND_ROUTES.PROFILE.EMPLOYER.COMPLETE)

  if (isProfileCompletionPage) return null

  // Determine navigation items based on user role
  const getNavItems = () => {
    const role = user.role

    // Map both role systems: doctor/hospital and candidate/employer
    if (role === UserRole.candidate) {
      return getCandidateNavItems()
    } else if (role === UserRole.employer) {
      return getEmployerNavItems()
    }

    // Default to candidate navigation for admin or unknown roles
    return getCandidateNavItems()
  }

  const items = getNavItems()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "fill-primary/10")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
