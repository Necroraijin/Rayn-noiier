"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  CheckSquare
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"

export function AppSidebar() {
  const pathname = usePathname()
  const { role } = useAuth()

  const navItems = [
    { name: "Dashboard", href: "/", icon: BarChart, roles: ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER", "COUNSEL", "SENIOR_ASSOCIATE", "ASSOCIATE", "INTERN", "PARALEGAL", "BILLING_ADMIN", "GUEST_CLIENT"] },
    { name: "Tasks", href: "/tasks", icon: CheckSquare, roles: ["SUPER_ADMIN", "SENIOR_ASSOCIATE", "ASSOCIATE", "INTERN", "PARALEGAL"] },
    { name: "Strategy", href: "/strategy", icon: Sparkles, roles: ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER", "COUNSEL"] },
    { name: "Research", href: "/research", icon: Search, roles: ["SUPER_ADMIN", "COUNSEL", "SENIOR_ASSOCIATE", "ASSOCIATE", "INTERN"] },
    { name: "Matters", href: "/cases", icon: Briefcase, roles: ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER", "COUNSEL", "SENIOR_ASSOCIATE", "ASSOCIATE", "PARALEGAL", "GUEST_CLIENT"] },
    { name: "Clients", href: "/clients", icon: Users, roles: ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER"] },
    { name: "Team", href: "/team", icon: Network, roles: ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER", "SENIOR_ASSOCIATE"] },
    { name: "Review Queue", href: "/review", icon: ShieldCheck, roles: ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER", "SENIOR_ASSOCIATE"] },
    { name: "Drafting", href: "/drafting", icon: FileText, roles: ["SUPER_ADMIN", "COUNSEL", "SENIOR_ASSOCIATE", "ASSOCIATE"] },
    { name: "Library", href: "/library", icon: Library, roles: ["SUPER_ADMIN", "COUNSEL", "PARALEGAL"] },
    { name: "Billing", href: "/billing", icon: Receipt, roles: ["SUPER_ADMIN", "EQUITY_PARTNER", "SALARIED_PARTNER", "BILLING_ADMIN", "SENIOR_ASSOCIATE", "ASSOCIATE", "INTERN", "PARALEGAL", "GUEST_CLIENT"] },
    { name: "Analytics", href: "/analytics", icon: BarChart, roles: ["SUPER_ADMIN", "EQUITY_PARTNER", "BILLING_ADMIN"] },
    { name: "Analysis", href: "/documents", icon: FileText, roles: ["SUPER_ADMIN", "INTERN", "EQUITY_PARTNER", "SALARIED_PARTNER", "COUNSEL", "SENIOR_ASSOCIATE", "ASSOCIATE", "PARALEGAL", "GUEST_CLIENT"] },
    { name: "Calendar", href: "/calendar", icon: CalendarIcon, roles: ["SUPER_ADMIN", "INTERN", "EQUITY_PARTNER", "SALARIED_PARTNER", "COUNSEL", "SENIOR_ASSOCIATE", "PARALEGAL", "GUEST_CLIENT"] },
    { name: "Comms", href: "/communications", icon: MessageSquare, roles: ["SUPER_ADMIN", "INTERN", "EQUITY_PARTNER", "SALARIED_PARTNER", "COUNSEL", "SENIOR_ASSOCIATE", "ASSOCIATE", "PARALEGAL", "GUEST_CLIENT"] },
    { name: "Learning", href: "/learning", icon: GraduationCap, roles: ["SUPER_ADMIN", "ASSOCIATE", "INTERN"] },
    { name: "Audit", href: "/audit", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
    { name: "Settings", href: "/settings", icon: Settings, roles: ["SUPER_ADMIN"] },
  ]

  const filteredNavItems = navItems.filter(item => item.roles.includes(role || ""))
  const { email } = useAuth()
  const initials = email ? email.substring(0, 2).toUpperCase() : "AT"

  return (
    <nav className="w-[70px] border-r border-white/10 flex flex-col items-center py-8 space-y-10 bg-[#050505] shrink-0">
      <div className="text-xl font-bold tracking-tighter">R.</div>
      
      <div className="flex flex-col space-y-8">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Tooltip key={item.name}>
              <TooltipTrigger render={<Link href={item.href} />}>
                <div className={cn("p-2 transition-colors rounded-lg flex items-center justify-center", isActive ? "text-white bg-white/10" : "text-white/40 hover:text-white")}>
                  <item.icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                  <span className="sr-only">{item.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-white/10 border-white/10 text-[10px] tracking-widest uppercase rounded">
                {item.name}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      <div className="mt-auto flex flex-col space-y-6">
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
