import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Search, Menu } from "lucide-react"
import { useAuth, Role } from "@/lib/auth-context"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

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
            
            <span className="hidden sm:inline-block text-xs text-white/30 uppercase tracking-[0.2em] font-medium mr-4 shrink-0">Search System</span>
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
            <span className="hidden lg:inline-block">RBAC: {roleDisplay}</span>
            <span className="hidden lg:inline-block text-emerald-400">E2E Encrypted</span>
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
