"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Search, Menu, ChevronDown, Building2, Shield } from "lucide-react"
import { useAuth, Role } from "@/lib/auth-context"
import { useTenant } from "@/lib/tenant-context"
import { useAuditLog } from "@/lib/audit-logger"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { role, email, logout } = useAuth()
  const { tenant, tenants, switchTenant } = useTenant()
  const { log } = useAuditLog()
  const [tenantOpen, setTenantOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const getRoleDisplay = (r: Role) => {
    switch (r) {
      case "SUPER_ADMIN": return "Super Admin"
      case "EQUITY_PARTNER": return "Equity Partner"
      case "SALARIED_PARTNER": return "Salaried Partner"
      case "COUNSEL": return "Counsel"
      case "SENIOR_ASSOCIATE": return "Senior Associate"
      case "ASSOCIATE": return "Associate"
      case "INTERN": return "Junior Associate"
      case "PARALEGAL": return "Paralegal"
      case "BILLING_ADMIN": return "Billing Admin"
      case "GUEST_CLIENT": return "Client"
      default: return "User"
    }
  }
  const roleDisplay = getRoleDisplay(role)
  const initials = email ? email.substring(0, 2).toUpperCase() : "AT"

  // Close dropdown on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTenantOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleTenantSwitch = (id: string) => {
    const target = tenants.find(t => t.id === id)
    log({
      tenantId: tenant.id,
      category: "SYSTEM",
      event: "TENANT_CONTEXT_SWITCH",
      actor: email || "unknown",
      ip: "192.168.1.1",
      severity: "WARNING",
      details: `Switched workspace from ${tenant.name} to ${target?.name}`,
    })
    switchTenant(id)
    setTenantOpen(false)
  }

  return (
    <div className="flex h-screen w-full bg-[#050505] text-[#F0F0F0] overflow-hidden">
      <div className="hidden md:flex h-full">
        <AppSidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center flex-1 min-w-0">
            <Sheet>
              <SheetTrigger className="md:hidden p-2 -ml-2 mr-2 text-white/60 hover:text-white shrink-0 flex items-center justify-center">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle mobile menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80px] p-0 bg-[#050505] border-r border-white/10">
                <VisuallyHidden>
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>Main navigation menu for the application.</SheetDescription>
                </VisuallyHidden>
                <AppSidebar />
              </SheetContent>
            </Sheet>

            {/* ─── Tenant Switcher ─────────────────────────────── */}
            {role === "SUPER_ADMIN" ? (
              <div className="relative mr-4 shrink-0" ref={dropdownRef}>
                <button
                  onClick={() => setTenantOpen(!tenantOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all"
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                    {tenant.logo}
                  </div>
                  <span className="text-xs font-medium text-white/70 hidden sm:inline max-w-[120px] truncate">{tenant.name}</span>
                  <ChevronDown className={`w-3 h-3 text-white/30 transition-transform ${tenantOpen ? "rotate-180" : ""}`} />
                </button>

                {tenantOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-[9px] uppercase tracking-widest font-mono text-white/30">Switch Workspace</p>
                    </div>
                    {tenants.map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleTenantSwitch(t.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors text-left ${t.id === tenant.id ? "bg-emerald-500/5 border-l-2 border-emerald-500" : "border-l-2 border-transparent"}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${t.id === tenant.id ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-white/5 border border-white/10 text-white/50"}`}>
                          {t.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-white/80 truncate">{t.name}</div>
                          <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{t.domain} • {t.region}</div>
                        </div>
                        {t.id === tenant.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 mr-4 shrink-0">
                <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                  {tenant.logo}
                </div>
                <span className="text-xs font-medium text-white/50 hidden sm:inline">{tenant.name}</span>
              </div>
            )}

            <div className="hidden sm:flex flex-1 max-w-xl items-center bg-white/5 border border-white/10 rounded-md px-4 py-1.5 text-sm mr-4">
              <input 
                type="text" 
                placeholder="CASE:1024 AND STATUS:ACTIVE..." 
                className="bg-transparent border-none focus:ring-0 outline-none w-full text-white/80 placeholder:text-white/20 uppercase tracking-widest min-w-0"
              />
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/40 ml-2 font-mono shrink-0">⌘K</span>
            </div>
            {/* Mobile search icon */}
            <button className="sm:hidden p-2 text-white/60 hover:text-white ml-2">
               <Search className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex space-x-3 md:space-x-6 text-[10px] uppercase tracking-[0.2em] text-white/60 items-center shrink-0">
            <span className="hidden lg:inline-block">{roleDisplay}</span>
            <span className="hidden lg:inline-block text-emerald-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> E2EE
            </span>
            <button 
              onClick={logout}
              className="text-white/60 hover:text-white transition-colors"
            >
              Log Out
            </button>
            <div className="h-8 w-8 ml-2 rounded-full border border-white/30 bg-white/10 text-[10px] flex items-center justify-center font-bold font-mono tracking-normal text-white shrink-0">
              {initials}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
