"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PlusSquare, Bell, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BottomTabs() {
  const pathname = usePathname()

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      id: "create",
      label: "Create Post",
      icon: PlusSquare,
      href: "/create-post",
    },
    {
      id: "updates",
      label: "Updates",
      icon: Bell,
      href: "/updates",
    },
    {
      id: "tools",
      label: "Tools",
      icon: Settings,
      href: "/tools",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full lg:w-5/12 bg-background border-t border-border shadow-lg">
        <div className="flex items-center justify-between px-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-3 px-1",
                "transition-colors duration-200",
                pathname === tab.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon
                className={cn("h-5 w-5 mb-1", pathname === tab.href ? "text-primary" : "text-muted-foreground")}
              />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
