"use client"

import React, { useState, useEffect, useRef } from "react"
import { Shield, KeyRound, Loader2, Lock, Fingerprint, ChevronRight, Building2, ArrowLeft, Eye, EyeOff, CheckCircle2, AlertTriangle, Globe } from "lucide-react"
import { useAuth, Role } from "@/lib/auth-context"
import { signIn } from "next-auth/react"
import WavePlusSymbols from "./wave-plus-symbols"

// ── Simulated tenant directory ──────────────────────────────────────
const TENANTS = [
  { id: "rayn", name: "Rayn & Partners LLP", domain: "rayn.law", region: "us-east-1", logo: "R" },
  { id: "apex", name: "Apex Legal Group", domain: "apexlegal.com", region: "eu-west-1", logo: "A" },
  { id: "meridian", name: "Meridian Chambers", domain: "meridian.co.uk", region: "ap-south-1", logo: "M" },
]

// ── Simulated user directory (per tenant) ───────────────────────────
const USER_DIRECTORY: Record<string, { email: string; name: string; role: Role; mfaEnabled: boolean }[]> = {
  rayn: [
    { email: "admin@rayn.law", name: "System Administrator", role: "SUPER_ADMIN", mfaEnabled: true },
    { email: "equity@rayn.law", name: "James Whitfield", role: "EQUITY_PARTNER", mfaEnabled: true },
    { email: "partner@rayn.law", name: "Laura Chen", role: "SALARIED_PARTNER", mfaEnabled: true },
    { email: "counsel@rayn.law", name: "Marcus Dean", role: "COUNSEL", mfaEnabled: false },
    { email: "senior@rayn.law", name: "Sarah Jenkins", role: "SENIOR_ASSOCIATE", mfaEnabled: false },
    { email: "associate@rayn.law", name: "Michael Tass", role: "ASSOCIATE", mfaEnabled: false },
    { email: "intern@rayn.law", name: "David Sullivan", role: "INTERN", mfaEnabled: false },
    { email: "paralegal@rayn.law", name: "Jessica Rivera", role: "PARALEGAL", mfaEnabled: false },
    { email: "billing@rayn.law", name: "Finance Department", role: "BILLING_ADMIN", mfaEnabled: true },
    { email: "client@rayn.law", name: "OmniCorp Legal", role: "GUEST_CLIENT", mfaEnabled: false },
  ],
  apex: [
    { email: "admin@apexlegal.com", name: "Apex Admin", role: "SUPER_ADMIN", mfaEnabled: true },
    { email: "partner@apexlegal.com", name: "Nadia Petrova", role: "EQUITY_PARTNER", mfaEnabled: true },
    { email: "associate@apexlegal.com", name: "Tom Harrington", role: "ASSOCIATE", mfaEnabled: false },
  ],
  meridian: [
    { email: "admin@meridian.co.uk", name: "Meridian Admin", role: "SUPER_ADMIN", mfaEnabled: true },
    { email: "counsel@meridian.co.uk", name: "Eleanor Voss", role: "COUNSEL", mfaEnabled: false },
  ],
}

type Step = "tenant" | "credentials" | "mfa" | "authenticating"

export default function LoginPage() {
  const [step, setStep] = useState<Step>("credentials")
  const [selectedTenant, setSelectedTenant] = useState<typeof TENANTS[0] | null>({
    id: "rayn",
    name: "Rayn & Partners LLP",
    domain: "rayn.law",
    region: "us-east-1",
    logo: "R"
  })
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [mfaCode, setMfaCode] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const { login } = useAuth()
  const mfaRefs = useRef<(HTMLInputElement | null)[]>([])

  // Clock tick
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // ── Handlers ────────────────────────────────────────────────────────

  const handleTenantSelect = (tenant: typeof TENANTS[0]) => {
    setSelectedTenant(tenant)
    setStep("credentials")
    setError("")
  }

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.")
      return
    }

    // Look up user in tenant directory
    const tenantUsers = USER_DIRECTORY[selectedTenant?.id || ""] || []
    let matchedUser = tenantUsers.find(u => u.email.toLowerCase() === email.toLowerCase())

    // Fallback: infer role from email keywords (for demo flexibility)
    if (!matchedUser) {
      let assignedRole: Role = "ASSOCIATE"
      const lowerEmail = email.toLowerCase()
      if (lowerEmail.includes("admin") && !lowerEmail.includes("billing")) assignedRole = "SUPER_ADMIN"
      else if (lowerEmail.includes("equity")) assignedRole = "EQUITY_PARTNER"
      else if (lowerEmail.includes("partner") || lowerEmail.includes("director")) assignedRole = "SALARIED_PARTNER"
      else if (lowerEmail.includes("counsel")) assignedRole = "COUNSEL"
      else if (lowerEmail.includes("senior")) assignedRole = "SENIOR_ASSOCIATE"
      else if (lowerEmail.includes("associate")) assignedRole = "ASSOCIATE"
      else if (lowerEmail.includes("intern") || lowerEmail.includes("trainee") || lowerEmail.includes("junior")) assignedRole = "INTERN"
      else if (lowerEmail.includes("paralegal")) assignedRole = "PARALEGAL"
      else if (lowerEmail.includes("billing") || lowerEmail.includes("finance")) assignedRole = "BILLING_ADMIN"
      else if (lowerEmail.includes("client") || lowerEmail.includes("guest")) assignedRole = "GUEST_CLIENT"

      matchedUser = { email, name: email.split("@")[0], role: assignedRole, mfaEnabled: assignedRole === "SUPER_ADMIN" }
    }

    // If MFA required, show MFA step
    if (matchedUser.mfaEnabled) {
      setStep("mfa")
      return
    }

    // Otherwise, authenticate directly
    performLogin(matchedUser.email, matchedUser.role)
  }

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = mfaCode.join("")
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code.")
      return
    }
    setError("")

    const tenantUsers = USER_DIRECTORY[selectedTenant?.id || ""] || []
    const matchedUser = tenantUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    performLogin(matchedUser?.email || email, matchedUser?.role || "ASSOCIATE")
  }

  const handleMfaInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newCode = [...mfaCode]
    newCode[index] = value.slice(-1)
    setMfaCode(newCode)
    if (value && index < 5) {
      mfaRefs.current[index + 1]?.focus()
    }
  }

  const handleMfaKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !mfaCode[index] && index > 0) {
      mfaRefs.current[index - 1]?.focus()
    }
  }

  const performLogin = (loginEmail: string, role: Role) => {
    setStep("authenticating")
    setIsLoading(true)

    // Check if the credentials correspond to mock domains
    const isMockDomain = loginEmail.endsWith("@rayn.law") || loginEmail.endsWith("@apexlegal.com") || loginEmail.endsWith("@meridian.co.uk")

    setTimeout(() => {
      if (isMockDomain) {
        login(loginEmail, role)
      } else {
        // Redirection to AWS Cognito hosted login screen via NextAuth
        signIn("cognito", { callbackUrl: "/" })
      }
    }, 2200)
  }

  const goBack = () => {
    setError("")
    if (step === "mfa") { 
      setStep("credentials")
      setMfaCode(["", "", "", "", "", ""])
    }
  }

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen w-full bg-[#030303] text-[#F0F0F0] flex overflow-hidden font-sans relative">
      {/* Wave pattern of green + symbols at the top */}
      <WavePlusSymbols count={10} className="absolute top-8 left-0 right-0 h-24 opacity-30 z-20" />

      {/* ─── Left Panel: Branding ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative flex-col justify-between p-12 overflow-hidden border-r border-white/5 bg-black">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-[#030303] to-emerald-950/20" />
        
        {/* Wave pattern of green + symbols for branding area */}
        <WavePlusSymbols count={5} className="absolute top-[30%] left-0 right-0 h-20 opacity-20" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-emerald-400/5 rounded-full blur-[80px]" />

        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-12 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <span className="text-2xl font-bold tracking-tighter text-emerald-400">R.</span>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Rayn</h2>
              <p className="text-[9px] uppercase tracking-[0.3em] text-emerald-400/60 font-mono">Enterprise Legal Intelligence</p>
            </div>
          </div>
          <h1 className="text-5xl xl:text-6xl font-light tracking-tighter leading-[1.1] font-serif italic">
            Secure.<br />
            <span className="text-emerald-400">Intelligent.</span><br />
            Enterprise.
          </h1>
          <p className="mt-8 text-sm text-white/40 leading-relaxed max-w-md font-serif">
            Multi-tenant legal intelligence platform with military-grade encryption, 
            AI-powered document analysis, and real-time compliance monitoring.
          </p>
        </div>

        {/* Bottom: Security badges */}
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap gap-3">
            {["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA"].map(badge => (
              <div key={badge} className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-mono text-emerald-400/50 border border-emerald-500/15 bg-emerald-500/5 px-3 py-1.5 rounded-full">
                <Shield className="w-3 h-3" />
                {badge}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 text-[9px] text-white/20 uppercase tracking-widest font-mono">
            <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> AES-256 Encrypted</span>
            <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Multi-Region</span>
          </div>
          <p className="text-[9px] text-white/15 font-mono uppercase tracking-widest">
            © 2026 Rayn Intelligence Systems. All rights reserved.
          </p>
        </div>
      </div>

      {/* ─── Right Panel: Auth Form ───────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center relative p-6 sm:p-8">
        {/* Background subtle pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent pointer-events-none" />

        <div className="w-full max-w-[440px] relative z-10">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              {step !== "credentials" && step !== "authenticating" && (
                <button onClick={goBack} className="p-2 -ml-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-lg font-bold tracking-tighter text-emerald-400">R.</span>
                </div>
                <span className="font-bold tracking-tight">Rayn</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[9px] font-mono text-white/25 uppercase tracking-widest">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              <span className="hidden sm:inline">{currentTime} UTC</span>
            </div>
          </div>



          {/* ─── Step: Credentials ────────────────────────────────── */}
          {step === "credentials" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Tenant badge */}
              <div className="flex items-center gap-3 mb-8 p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400 shrink-0">
                  {selectedTenant?.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white/70 truncate">{selectedTenant?.name}</div>
                  <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{selectedTenant?.domain}</div>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400/60 uppercase tracking-widest shrink-0">
                  <Lock className="w-3 h-3" /> TLS 1.3
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-light font-serif italic tracking-tight mb-2">Authenticate</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">AWS Cognito · Secure Gateway</p>
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 flex items-center gap-2">
                    <Shield className="w-3 h-3 text-white/25" /> Firm Email
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      const val = e.target.value
                      setEmail(val)
                      const parts = val.split("@")
                      if (parts.length > 1) {
                        const domain = parts[1].toLowerCase()
                        const matched = TENANTS.find(t => t.domain.toLowerCase() === domain)
                        if (matched) {
                          setSelectedTenant(matched)
                        } else if (domain.includes(".")) {
                          const namePrefix = domain.split(".")[0]
                          setSelectedTenant({
                            id: "custom",
                            name: namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1) + " Workspace",
                            domain: domain,
                            region: "us-east-1",
                            logo: namePrefix.charAt(0).toUpperCase()
                          })
                        }
                      } else {
                        setSelectedTenant({
                          id: "rayn",
                          name: "Rayn & Partners LLP",
                          domain: "rayn.law",
                          region: "us-east-1",
                          logo: "R"
                        })
                      }
                    }}
                    placeholder={`user@${selectedTenant?.domain || "firm.com"}`}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm font-mono placeholder:text-white/15 outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 flex items-center gap-2">
                    <KeyRound className="w-3 h-3 text-white/25" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 pr-12 text-sm tracking-widest placeholder:text-white/15 outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-white text-[#030303] hover:bg-white/90 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl px-4 py-4 transition-all flex items-center justify-center gap-2 mt-2 font-mono shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                >
                  Continue <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between border-b border-white/[0.04] pb-6">
                <button type="button" className="text-[10px] text-white/25 hover:text-emerald-400/70 uppercase tracking-widest font-mono transition-colors">Forgot Password?</button>
                <button type="button" className="text-[10px] text-white/25 hover:text-emerald-400/70 uppercase tracking-widest font-mono transition-colors">Use Passkey</button>
              </div>

              {/* SSO Option */}
              <div className="relative my-6 animate-in fade-in duration-700">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
                <div className="relative flex justify-center text-[9px] uppercase tracking-[0.2em] font-mono">
                  <span className="bg-[#030303] px-4 text-white/20">Or Continue with SSO</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 animate-in fade-in duration-700">
                {[
                  { name: "Microsoft", abbr: "MS" },
                  { name: "Google", abbr: "G" },
                  { name: "Okta", abbr: "OK" },
                ].map(sso => (
                  <button 
                    type="button"
                    key={sso.name}
                    onClick={() => {
                      setStep("authenticating")
                      setIsLoading(true)
                      setTimeout(() => {
                        // SSO Auth login mock fallback
                        login("partner@rayn.law", "EQUITY_PARTNER")
                      }, 2200)
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-emerald-500/30 hover:text-emerald-400 transition-all text-[10px] font-bold uppercase tracking-widest text-white/40"
                  >
                    <span className="text-[10px] font-mono font-bold tracking-tight">{sso.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── Step: MFA ────────────────────────────────────────── */}
          {step === "mfa" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center">
                  <Fingerprint className="w-7 h-7 text-emerald-400" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-light font-serif italic tracking-tight mb-2">Two-Factor Verification</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono">
                  Enter the 6-digit code from your authenticator app
                </p>
                <p className="text-xs text-white/25 mt-3 font-mono">{email}</p>
              </div>

              <form onSubmit={handleMfaSubmit} className="space-y-6">
                <div className="flex justify-center gap-3">
                  {mfaCode.map((digit, i) => (
                    <React.Fragment key={i}>
                      {i === 3 && <div className="w-3 flex items-center justify-center text-white/10">–</div>}
                      <input
                        ref={(el) => { mfaRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleMfaInput(i, e.target.value)}
                        onKeyDown={(e) => handleMfaKeyDown(i, e)}
                        className="w-12 h-14 bg-white/[0.03] border border-white/[0.08] rounded-xl text-center text-lg font-mono font-bold outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
                      />
                    </React.Fragment>
                  ))}
                </div>

                {error && (
                  <div className="flex items-center justify-center gap-2 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-white text-[#030303] hover:bg-white/90 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl px-4 py-4 transition-all flex items-center justify-center gap-2"
                >
                  Verify & Sign In <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <button className="text-[10px] text-white/25 hover:text-emerald-400/70 uppercase tracking-widest font-mono transition-colors">
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {/* ─── Step: Authenticating ─────────────────────────────── */}
          {step === "authenticating" && (
            <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center py-16">
              <div className="relative mb-8">
                <div className="w-16 h-16 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
                </div>
                <div className="absolute -inset-4 border border-emerald-500/10 rounded-3xl animate-pulse" />
              </div>

              <h2 className="text-lg font-light font-serif italic tracking-tight mb-3">Establishing Secure Session</h2>

              <div className="space-y-3 w-full max-w-xs">
                <AuthStep label="Cognito token exchange" delay={0} />
                <AuthStep label="Tenant schema binding" delay={400} />
                <AuthStep label="RBAC policy resolution" delay={800} />
                <AuthStep label="Encryption handshake" delay={1200} />
                <AuthStep label="Session initialized" delay={1700} />
              </div>
            </div>
          )}

          {/* Bottom security note */}
          {step !== "authenticating" && (
            <div className="mt-10 pt-6 border-t border-white/[0.04]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[9px] uppercase tracking-widest font-mono text-white/15">
                <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Zero-Trust Architecture</span>
                <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> E2EE Protected</span>
              </div>
              {step === "tenant" && (
                <p className="text-center text-[9px] uppercase tracking-widest font-mono text-white/10 mt-4 leading-relaxed">
                  Hint: Use emails like admin@, equity@, counsel@, associate@, intern@, billing@, client@ with any listed domain. Any password works.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sub-component: Animated auth step ────────────────────────────────
function AuthStep({ label, delay }: { label: string; delay: number }) {
  const [visible, setVisible] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay)
    const t2 = setTimeout(() => setDone(true), delay + 350)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [delay])

  if (!visible) return <div className="h-6" />

  return (
    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {done ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
      ) : (
        <Loader2 className="w-3.5 h-3.5 text-white/30 animate-spin shrink-0" />
      )}
      <span className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-300 ${done ? "text-emerald-400/70" : "text-white/30"}`}>
        {label}
      </span>
    </div>
  )
}
