"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Stethoscope, Briefcase, MessageSquare, User, Users, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  {
    href: "/dashboard",
    label: "Home",
    icon: Stethoscope,
  },
  {
    href: "/jobs",
    label: "Jobs",
    icon: Briefcase,
  },
  {
    href: "/doctors",
    label: "Doctors",
    icon: Users,
  },
  {
    href: "/hospitals",
    label: "Hospitals",
    icon: Home,
  },
  {
    href: "/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

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
