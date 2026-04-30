import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Search } from "lucide-react"
import { useAuth, Role } from "@/lib/auth-context"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { role, email, logout } = useAuth()
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

  return (
    <div className="flex h-screen w-full bg-[#050505] text-[#F0F0F0]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 flex items-center px-8 shrink-0">
          <div className="flex-1 flex items-center">
            <span className="text-xs text-white/30 uppercase tracking-[0.2em] font-medium mr-4">Search System</span>
            <div className="w-full max-w-xl flex items-center bg-white/5 border border-white/10 rounded-md px-4 py-1.5 text-sm">
              <input 
                type="text" 
                placeholder="CASE:1024 AND STATUS:ACTIVE NOT ARCHIVED" 
                className="bg-transparent border-none focus:ring-0 outline-none w-full text-white/80 placeholder:text-white/20 uppercase tracking-widest"
              />
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/40 ml-2 font-mono">⌘K</span>
            </div>
          </div>
          <div className="flex space-x-6 text-[10px] uppercase tracking-[0.2em] text-white/60 items-center">
            <span>RBAC: {roleDisplay}</span>
            <span className="text-emerald-400">E2E Encrypted</span>
            <button 
              onClick={logout}
              className="text-white/60 hover:text-white transition-colors"
            >
              Log Out
            </button>
            <div className="h-8 w-8 ml-2 rounded-full border border-white/30 bg-white/10 text-[10px] flex items-center justify-center font-bold font-mono tracking-normal text-white">
              {initials}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
