"use client"

import React, { useState } from "react"
import { Shield, KeyRound, Loader2, Scale } from "lucide-react"
import { useAuth, Role } from "@/lib/auth-context"
import { getUsers } from "@/lib/local-db"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const users = await getUsers();
      const lowerEmail = email.toLowerCase();
      const localUser = users.find(u => u.email.toLowerCase() === lowerEmail);
      
      setTimeout(() => {
        setIsLoading(false)
        if (localUser) {
          login(email, localUser.role as Role, localUser.permissions || [])
          return
        }
        
        let assignedRole: Role = "ASSOCIATE"
        let defaultPerms: string[] = []
        if (lowerEmail.includes("admin") && !lowerEmail.includes("billing")) {
          assignedRole = "SUPER_ADMIN"
          defaultPerms = ["Tasks", "Strategy", "Research", "Matters", "Clients", "Team", "Review Queue", "Drafting", "Library", "Billing", "Analytics", "Analysis", "Calendar", "Comms", "Learning", "Audit", "Settings"]
        } else if (lowerEmail.includes("equity")) {
          assignedRole = "EQUITY_PARTNER"
          defaultPerms = ["Tasks", "Strategy", "Matters", "Clients", "Team", "Review Queue", "Billing", "Analytics", "Analysis", "Calendar", "Comms"]
        } else if (lowerEmail.includes("partner") || lowerEmail.includes("director")) {
          assignedRole = "SALARIED_PARTNER"
          defaultPerms = ["Tasks", "Strategy", "Matters", "Clients", "Team", "Review Queue", "Billing", "Analysis", "Calendar", "Comms"]
        } else if (lowerEmail.includes("counsel")) {
          assignedRole = "COUNSEL"
          defaultPerms = ["Tasks", "Strategy", "Research", "Matters", "Drafting", "Library", "Analysis", "Calendar", "Comms"]
        } else if (lowerEmail.includes("senior")) {
          assignedRole = "SENIOR_ASSOCIATE"
          defaultPerms = ["Tasks", "Research", "Matters", "Team", "Review Queue", "Drafting", "Billing", "Analysis", "Calendar", "Comms"]
        } else if (lowerEmail.includes("associate")) {
          assignedRole = "ASSOCIATE"
          defaultPerms = ["Tasks", "Research", "Matters", "Drafting", "Billing", "Analysis", "Comms", "Learning"]
        } else if (lowerEmail.includes("intern") || lowerEmail.includes("trainee") || lowerEmail.includes("junior")) {
          assignedRole = "INTERN"
          defaultPerms = ["Tasks", "Research", "Billing", "Analysis", "Calendar", "Comms", "Learning"]
        } else if (lowerEmail.includes("paralegal")) {
          assignedRole = "PARALEGAL"
          defaultPerms = ["Tasks", "Matters", "Library", "Billing", "Analysis", "Calendar", "Comms"]
        } else if (lowerEmail.includes("billing") || lowerEmail.includes("finance")) {
          assignedRole = "BILLING_ADMIN"
          defaultPerms = ["Billing", "Analytics"]
        } else if (lowerEmail.includes("client") || lowerEmail.includes("guest")) {
          assignedRole = "GUEST_CLIENT"
          defaultPerms = ["Matters", "Billing", "Analysis", "Calendar", "Comms"]
        }
        login(email, assignedRole, defaultPerms)
      }, 1500)
    } catch (err) {
       console.error("Local DB fetch failed", err);
       setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#F0F0F0] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="w-16 h-16 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <span className="text-3xl font-bold tracking-tighter">R.</span>
          </div>
          <h1 className="text-5xl font-light tracking-tighter mb-3 italic font-serif text-center">Rayn</h1>
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-emerald-400 font-bold">Secure Node</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-white/60 mb-1">Authentication</h2>
            <p className="text-[10px] text-white/40 tracking-widest uppercase font-mono">E2EE Gateway v2.4</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
                <Shield className="w-3 h-3 text-white/40" />
                Firm Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="A.TAYLOR@RAYN.LAW"
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm font-mono placeholder:text-white/20 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
                <KeyRound className="w-3 h-3 text-white/40" />
                Master Passkey
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-sm tracking-widest placeholder:text-white/20 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-widest rounded px-4 py-4 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="animate-pulse">Decrypting...</span>
                  </>
                ) : (
                  "Initialize Session"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center animate-in fade-in duration-1000 delay-300 fill-mode-both text-[9px] uppercase tracking-widest font-mono text-white/30 space-y-2">
          <p>Restricted Access. Authorized Personnel Only.</p>
          <p>Hint: use email with &quot;equity&quot;, &quot;director&quot;, &quot;counsel&quot;, &quot;senior&quot;, &quot;associate&quot;, &quot;intern&quot;, &quot;paralegal&quot;, &quot;billing&quot;, &quot;client&quot;.</p>
        </div>
      </div>
    </div>
  )
}
