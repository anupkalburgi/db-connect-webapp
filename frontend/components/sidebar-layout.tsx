"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PanelLeftIcon, PanelRightIcon } from "lucide-react"
import { useState, type ReactNode } from "react"

interface SidebarLayoutProps {
  children: ReactNode
  sidebar: ReactNode
}

export function SidebarLayout({ children, sidebar }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={cn("border-r bg-muted/10 transition-all duration-300 ease-in-out", isCollapsed ? "w-0" : "w-80")}>
        <div className="flex h-full">
          <div className={cn("flex-1", isCollapsed ? "hidden" : "block")}>{sidebar}</div>
          {/* Collapse button */}
          <div className="border-l">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-12 w-6 rounded-none"
            >
              {isCollapsed ? <PanelRightIcon className="h-4 w-4" /> : <PanelLeftIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

