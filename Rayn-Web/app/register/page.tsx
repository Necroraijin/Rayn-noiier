"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Shield, Lock, ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertTriangle, Building2, User, KeyRound } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh"
]

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  // Stepper state
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState("enterprise")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successData, setSuccessData] = useState<{ tenantId: string; email: string; role: string } | null>(null)

  // Form fields
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    password: "",
    confirmPassword: "",
    companyWebsite: "",
    gstNumber: "",
    panNumber: "",
    businessType: "Private Limited",
    signatoryName: "",
    contactNumber: "",
    address: "",
    state: "Maharashtra",
    pincode: "",
  })

  // Prefill plan from query param
  useEffect(() => {
    const planParam = searchParams.get("plan")
    if (planParam && ["professional", "enterprise", "unlimited"].includes(planParam)) {
      setSelectedPlan(planParam)
    }
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Field validation helper per step
  const validateStep = () => {
    setErrorMsg("")

    if (step === 1) {
      if (!formData.companyEmail.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
        setErrorMsg("Please fill out all credentials fields.")
        return false
      }
      if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) {
        setErrorMsg("Please enter a valid company email address.")
        return false
      }
      if (formData.password.length < 8) {
        setErrorMsg("Password must be at least 8 characters long.")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Passwords do not match.")
        return false
      }
    }

    if (step === 2) {
      if (!formData.companyName.trim() || !formData.gstNumber.trim() || !formData.panNumber.trim()) {
        setErrorMsg("Please fill out all company verification fields.")
        return false
      }

      // Validate GSTIN format (15 characters)
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
      if (formData.gstNumber.length !== 15) {
        setErrorMsg("GSTIN must be exactly 15 characters long.")
        return false
      }
      if (!gstRegex.test(formData.gstNumber.toUpperCase())) {
        setErrorMsg("Invalid GSTIN format. Example: 27AAAAA1111A1Z1")
        return false
      }

      // Validate PAN format (10 characters)
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
      if (formData.panNumber.length !== 10) {
        setErrorMsg("PAN must be exactly 10 characters long.")
        return false
      }
      if (!panRegex.test(formData.panNumber.toUpperCase())) {
        setErrorMsg("Invalid PAN format. Example: ABCDE1234F")
        return false
      }
    }

    if (step === 3) {
      if (!formData.signatoryName.trim() || !formData.contactNumber.trim() || !formData.address.trim() || !formData.pincode.trim()) {
        setErrorMsg("Please fill out all authorized contact details.")
        return false
      }
      if (!/^\d{10}$/.test(formData.contactNumber)) {
        setErrorMsg("Mobile number must be exactly 10 digits.")
        return false
      }
      if (!/^\d{6}$/.test(formData.pincode)) {
        setErrorMsg("Pincode must be exactly 6 digits.")
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setErrorMsg("")
    setStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) return

    setIsLoading(true)
    setErrorMsg("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, plan: selectedPlan }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Workspace provisioning failed.")
      }

      if (data.success) {
        setSuccessData({
          tenantId: data.tenantId,
          email: data.email,
          role: data.role,
        })
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || "An unexpected registration error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLaunchConsole = () => {
    if (successData) {
      // Log user in contextually and redirect
      login(successData.email, successData.role as any)
      localStorage.setItem("rayn_tenant", successData.tenantId)
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] text-[#F0F0F0] flex flex-col justify-between font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 lg:px-16 h-20 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#030303]/40 backdrop-blur-sm relative z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
            <span className="text-xl font-bold tracking-tighter text-emerald-400">R.</span>
          </div>
          <div>
            <h2 className="text-md font-bold tracking-tight text-white">Rayn</h2>
            <p className="text-[8px] uppercase tracking-[0.3em] text-emerald-400/60 font-mono">Workspace Provisioner</p>
          </div>
        </Link>
        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" /> SECURE HANDSHAKE (TLS 1.3)
        </span>
      </header>

      {/* Form Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-xl border border-white/10 rounded-3xl bg-black/60 backdrop-blur-md overflow-hidden shadow-2xl p-8 lg:p-10">
          
          {/* Stepper Header */}
          {!successData && (
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4 text-[9px] font-mono uppercase tracking-widest text-white/30">
                <span>Enterprise Registry</span>
                <span>Step {step} of 3</span>
              </div>
              <div className="flex gap-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full bg-emerald-400 transition-all duration-300 ${step >= 1 ? "w-1/3" : "w-0"}`} />
                <div className={`h-full bg-emerald-400 transition-all duration-300 ${step >= 2 ? "w-1/3" : "w-0"}`} />
                <div className={`h-full bg-emerald-400 transition-all duration-300 ${step >= 3 ? "w-1/3" : "w-0"}`} />
              </div>
            </div>
          )}

          {/* Stepper Logic Forms */}
          {successData ? (
            /* Success Congratulations Screen */
            <div className="text-center py-10 space-y-8 animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl font-light font-serif italic text-white mb-3">Workspace Provisioned</h1>
                <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
                  Congratulations! We have completed AWS tenant schema binding and Cognito token configurations for **{formData.companyName}**.
                </p>
              </div>

              {/* Dynamic Summary Table */}
              <div className="border border-white/10 rounded-xl p-5 bg-white/[0.01] text-left font-mono text-[10px] space-y-2 max-w-md mx-auto">
                <div className="flex justify-between"><span className="text-white/30">WORKSPACE ID:</span><span className="text-emerald-400">{successData.tenantId}</span></div>
                <div className="flex justify-between"><span className="text-white/30">ADMINISTRATOR:</span><span className="text-white">{formData.signatoryName}</span></div>
                <div className="flex justify-between"><span className="text-white/30">TENANT EMAIL:</span><span className="text-white">{formData.companyEmail}</span></div>
                <div className="flex justify-between"><span className="text-white/30">SUBSCRIPTION:</span><span className="text-white uppercase text-emerald-400">{selectedPlan}</span></div>
                <div className="flex justify-between"><span className="text-white/30">DATABASE SCHEMA:</span><span className="text-white">tenant_{successData.tenantId}</span></div>
              </div>

              <button
                onClick={handleLaunchConsole}
                className="w-full max-w-md bg-white text-black hover:bg-white/90 py-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all"
              >
                Launch Workspace Console
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Plan Selection Badge */}
              <div className="flex justify-between items-center p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Selected Tier:</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">{selectedPlan}</span>
              </div>

              {/* Error messages banner */}
              {errorMsg && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* ─── STEP 1: LOGIN CREDENTIALS ─── */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-4">
                    <h2 className="text-xl font-light font-serif italic text-white mb-1">Set Up Your Account</h2>
                    <p className="text-[9px] uppercase tracking-widest text-white/35 font-mono">AWS Cognito Login Credentials</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-white/20" /> Signatory Corporate Email
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      required
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      placeholder="e.g., managingpartner@rayn.law"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono placeholder:text-white/10 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-white/20" /> Account Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••••••••••"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm tracking-widest placeholder:text-white/10 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-white/20" /> Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••••••••••"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm tracking-widest placeholder:text-white/10 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* ─── STEP 2: COMPANY VERIFICATION ─── */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-4">
                    <h2 className="text-xl font-light font-serif italic text-white mb-1">Company Details</h2>
                    <p className="text-[9px] uppercase tracking-widest text-white/35 font-mono">Legal Verification Documents</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-white/20" /> Legal Entity Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g., Rayn & Partners LLP"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/10 outline-none focus:border-emerald-500/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Business Type</label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white/80 outline-none focus:border-emerald-500/40 h-[46px] select-style"
                      >
                        <option>Partnership LLP</option>
                        <option>Private Limited</option>
                        <option>Public Limited</option>
                        <option>Sole Proprietorship</option>
                        <option>Chambers / Individual</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Company Website</label>
                      <input
                        type="text"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleInputChange}
                        placeholder="e.g., www.rayn.law"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs placeholder:text-white/10 outline-none focus:border-emerald-500/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">GST Number (GSTIN)</label>
                      <input
                        type="text"
                        name="gstNumber"
                        required
                        maxLength={15}
                        value={formData.gstNumber}
                        onChange={handleInputChange}
                        placeholder="27AAAAA1111A1Z1"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono uppercase placeholder:text-white/10 outline-none focus:border-emerald-500/40 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Company PAN Card</label>
                      <input
                        type="text"
                        name="panNumber"
                        required
                        maxLength={10}
                        value={formData.panNumber}
                        onChange={handleInputChange}
                        placeholder="AAAAA1111A"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono uppercase placeholder:text-white/10 outline-none focus:border-emerald-500/40 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ─── STEP 3: REPRESENTATIVE & ADDRESS ─── */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-4">
                    <h2 className="text-xl font-light font-serif italic text-white mb-1">Authorized Contact & Address</h2>
                    <p className="text-[9px] uppercase tracking-widest text-white/35 font-mono">Compliance Signature Details</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Authorized Representative</label>
                      <input
                        type="text"
                        name="signatoryName"
                        required
                        value={formData.signatoryName}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs placeholder:text-white/10 outline-none focus:border-emerald-500/40 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Mobile Number</label>
                      <input
                        type="text"
                        name="contactNumber"
                        required
                        maxLength={10}
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="10-Digit Mobile"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono placeholder:text-white/10 outline-none focus:border-emerald-500/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Corporate Address</label>
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Registered corporate address details..."
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-xs placeholder:text-white/10 outline-none focus:border-emerald-500/40 h-16 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">State / Union Territory</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-xs text-white/80 outline-none focus:border-emerald-500/40 h-[46px] select-style"
                      >
                        {INDIAN_STATES.map(st => (
                          <option key={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Corporate Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="6-Digit Pin"
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono placeholder:text-white/10 outline-none focus:border-emerald-500/40 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-4 py-3 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-6 py-3 bg-white text-black hover:bg-white/90 text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all ml-auto"
                  >
                    Continue <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all ml-auto"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Deploy Workspace"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-white/5 flex items-center justify-center text-[9px] font-mono uppercase tracking-widest text-white/20 shrink-0 bg-[#030303]/40 backdrop-blur-sm">
        <p>Protected by AWS Secrets Manager & KMS Cryptographic controls.</p>
      </footer>
    </div>
  )
}
