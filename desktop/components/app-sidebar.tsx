"use client"

import * as React from "react"
import { 
  BarChart, 
  Briefcase, 
  Calendar as CalendarIcon, 
  FileText, 
  MessageSquare, 
  Settings, 
  ShieldCheck,
  Users,
  Sparkles,
  Receipt,
  Network,
  Library,
  GraduationCap,
  Search,
  CheckSquare,
  LayoutDashboard
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"
import { useNav } from "@/lib/nav-context"

export function AppSidebar() {
  const { activeView, setActiveView } = useNav()
  const { role, permissions, email } = useAuth()

  const navItems = [
    { name: "Dashboard", id: "dashboard", icon: LayoutDashboard },
    { name: "Tasks", id: "Tasks", icon: CheckSquare },
    { name: "Strategy", id: "Strategy", icon: Sparkles },
    { name: "Research", id: "Research", icon: Search },
    { name: "Matters", id: "Matters", icon: Briefcase },
    { name: "Clients", id: "Clients", icon: Users },
    { name: "Team", id: "Team", icon: Network },
    { name: "Review Queue", id: "Review Queue", icon: ShieldCheck },
    { name: "Drafting", id: "Drafting", icon: FileText },
    { name: "Library", id: "Library", icon: Library },
    { name: "Billing", id: "Billing", icon: Receipt },
    { name: "Analytics", id: "Analytics", icon: BarChart },
    { name: "Analysis", id: "Analysis", icon: FileText },
    { name: "Calendar", id: "Calendar", icon: CalendarIcon },
    { name: "Comms", id: "Comms", icon: MessageSquare },
    { name: "Learning", id: "Learning", icon: GraduationCap },
    { name: "Audit", id: "Audit", icon: ShieldCheck },
    { name: "Settings", id: "Settings", icon: Settings },
  ]

  // Filter items: always show dashboard, otherwise check granular permissions
  const filteredNavItems = navItems.filter(item => 
    item.id === "dashboard" || permissions.includes(item.id)
  )

  const initials = email ? email.substring(0, 2).toUpperCase() : "AT"

  return (
    <nav className="w-[70px] border-r border-white/10 flex flex-col items-center py-8 space-y-10 bg-[#050505] shrink-0">
      <div className="text-xl font-bold tracking-tighter cursor-pointer" onClick={() => setActiveView('dashboard')}>R.</div>
      
      <div className="flex flex-col space-y-8 overflow-y-auto no-scrollbar pb-4">
        {filteredNavItems.map((item) => {
          const isActive = activeView === item.id
          return (
            <Tooltip key={item.name}>
              <TooltipTrigger className={cn("p-2 transition-colors rounded-lg flex items-center justify-center outline-none", isActive ? "text-white bg-white/10" : "text-white/40 hover:text-white")} onClick={() => setActiveView(item.id)}>
                  <item.icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                  <span className="sr-only">{item.name}</span>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-white/10 border-white/10 text-[10px] tracking-widest uppercase rounded text-white">
                {item.name}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      <div className="mt-auto flex flex-col space-y-6 pt-4">
        <Tooltip>
          <TooltipTrigger render={<div />}>
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 cursor-pointer flex items-center justify-center overflow-hidden">
               <span className="text-[10px] font-bold tracking-tighter text-white">{initials}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-white/10 border-white/10 text-[10px] tracking-widest uppercase rounded text-emerald-400">
            CONNECTED
          </TooltipContent>
        </Tooltip>
      </div>
    </nav>
  )
}
