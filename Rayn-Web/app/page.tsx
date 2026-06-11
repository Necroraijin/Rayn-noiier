"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Scale, Sparkles, Shield, Activity, ArrowRight, CheckCircle2, ChevronRight, FileText, Search, Lock, Globe } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import WavePlusSymbols from "@/components/wave-plus-symbols"

export default function LandingPage() {
  const { role } = useAuth()
  const [activeFeature, setActiveFeature] = useState("drafting")

  const features = {
    drafting: {
      title: "Neural Drafting Studio",
      description: "Co-author formal legal briefs, pleadings, and agreements. Our AI drafting agent ensures strict clause structure, styling adherence, and firm-specific tone mapping.",
      icon: FileText,
      badge: "AI-Powered",
      preview: `// ARBITER Neural Generation - Severability Clause
"Section 12.8 Severability. If any provision of this Agreement is held to be invalid, illegal, or unenforceable in any jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, and the remaining provisions of this Agreement shall remain in full force and effect."`,
    },
    research: {
      title: "Multi-Agentic Legal RAG",
      description: "Leverage dual vector stores. Cite global Indian statutes (BNS, Constitution, Supreme Court precedents) alongside your secure, private firm case files with mathematically verified row-level security.",
      icon: Search,
      badge: "Indian Jurisdiction",
      preview: `// Retrieval Augmented Citation Check
Precedent Found: Smith v. OmniCorp (2024)
Court: Supreme Court of India
Citation: 2024 SCC 1402
Relevance: 94.2% match on unilateral termination restrictions.`,
    },
    audit: {
      title: "Cryptographic Audit Ledger",
      description: "Log every decryption, role update, and model run to an immutable audit ledger backed by DynamoDB. Keep your firm SOC 2 compliant automatically with zero-trust logging.",
      icon: Activity,
      badge: "Zero-Trust",
      preview: `// Immutable Audit Event Logs
[14:22:04] USER: admin@rayn.law | EVENT: KMS_KEY_ROTATION | SEVERITY: WARNING
[14:21:55] USER: associate@rayn.law | EVENT: FILE_DOWNLOAD | SEVERITY: INFO
[14:20:12] USER: SYSTEM | EVENT: SECURITY_INTEGRITY_CHECK | SEVERITY: SUCCESS`,
    },
  }

  return (
    <div className="min-h-screen bg-[#030303] text-[#F0F0F0] font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-[#030303]/70 px-6 lg:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
            <span className="text-xl font-bold tracking-tighter text-emerald-400">R.</span>
          </div>
          <div>
            <h2 className="text-md font-bold tracking-tight text-white">Rayn</h2>
            <p className="text-[8px] uppercase tracking-[0.3em] text-emerald-400/60 font-mono">Legal Intelligence</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[10px] uppercase font-bold tracking-widest text-white/50">
          <Link href="/" className="text-white hover:text-white transition-colors">Platform</Link>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
        </nav>

        <div className="flex items-center gap-4">
          {role ? (
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
            >
              Enter Console <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-[10px] uppercase tracking-widest font-bold text-white/60 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 border border-white/20 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
              >
                Register Firm
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-16 pt-20 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Wave pattern of green + symbols in the hero section */}
        <WavePlusSymbols count={12} className="absolute top-[10%] left-0 right-0 h-32 opacity-25" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/5 text-emerald-400 font-mono text-[9px] uppercase tracking-widest mb-8 animate-pulse relative z-10">
          <Sparkles className="w-3 h-3" /> Standardizing Enterprise Legal AI
        </div>

        <h1 className="text-5xl md:text-7xl font-light tracking-tighter leading-[1.05] max-w-4xl font-serif italic text-white mb-8">
          The Enterprise-Grade <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Legal Intelligence Hub</span>
        </h1>

        <p className="text-sm md:text-md text-white/50 max-w-2xl leading-relaxed mb-12">
          An isolated, multi-tenant B2B SaaS platform designed for modern law firms. Standardized on AWS Cognito, Amazon S3, RDS PostgreSQL, and AWS Bedrock to deliver fast, secure, and compliant legal operations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link 
            href="/register" 
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-white/90 text-black text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all"
          >
            Provision Your Workspace <ChevronRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/pricing" 
            className="flex items-center justify-center gap-2 px-8 py-4 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all"
          >
            Explore Tiers & Pricing
          </Link>
        </div>

        {/* Hero Interactive Terminal Mockup */}
        <div className="w-full max-w-4xl border border-white/10 rounded-2xl bg-black/60 backdrop-blur-md overflow-hidden shadow-2xl flex flex-col text-left">
          <div className="h-12 border-b border-white/10 px-6 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              <span className="ml-4 font-mono text-[10px] text-white/30 uppercase tracking-widest">Rayn Console // Case Smith v. OmniCorp</span>
            </div>
            <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" /> secure_active
            </span>
          </div>
          <div className="p-8 font-mono text-xs text-white/70 space-y-4 max-h-[300px] overflow-y-auto bg-black/40">
            <p className="text-white/30">// Initiating Multi-Agent Precedent Extraction...</p>
            <p className="text-emerald-400">✔ AWS Cognito session credentials resolved [Tenant ID: rayn-llp]</p>
            <p className="text-emerald-400">✔ Multi-tenant schema path bound: schema tenant_rayn</p>
            <p className="text-emerald-400">✔ Opposing brief read: Smithson_Complaint_unlocked.pdf (AES-256 decrypted)</p>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
              <p className="text-white font-bold mb-2">ARBITER Analysis Critique Summary:</p>
              <p className="text-white/60 leading-relaxed">
                Found unilateral limitation of liability (Section 8.4) referencing deprecated statutory precedents. 
                Recommendation: Draft cross-reference briefing utilizing Indian Supreme Court judgment SCC 1402 (2024) to void waiver clause.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-white/5 bg-white/[0.01] relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-emerald-400 mb-4">Core Modules</h2>
            <p className="text-3xl font-light font-serif italic text-white">Three specialized solutions, one centralized console.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Feature selector */}
            <div className="lg:col-span-4 space-y-4">
              {Object.entries(features).map(([key, f]) => {
                const isSelected = activeFeature === key
                return (
                  <button
                    key={key}
                    onClick={() => setActiveFeature(key)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-white/5 bg-transparent hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <f.icon className={`w-5 h-5 ${isSelected ? "text-emerald-400" : "text-white/30"}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-white/30">{f.badge}</span>
                    </div>
                    <h3 className="text-md font-serif italic text-white/95">{f.title}</h3>
                  </button>
                )
              })}
            </div>

            {/* Feature preview visual */}
            <div className="lg:col-span-8">
              <div className="border border-white/10 rounded-2xl p-8 bg-black/50 backdrop-blur-sm min-h-[300px] flex flex-col justify-between shadow-2xl">
                <div>
                  <h3 className="text-xl font-light font-serif italic text-white mb-4">
                    {features[activeFeature as keyof typeof features].title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed mb-6">
                    {features[activeFeature as keyof typeof features].description}
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-white/5 bg-black/60 font-mono text-[11px] text-white/60 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {features[activeFeature as keyof typeof features].preview}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Credentials */}
      <section id="security" className="py-24 border-t border-white/5 max-w-7xl mx-auto px-6 lg:px-16 text-center">
        <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-white/40 mb-4">Enterprise Compliance</h2>
        <p className="text-3xl font-light font-serif italic text-white mb-12">Zero-Trust. Zero Key Exposures.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { badge: "SOC 2 Type II", desc: "Security & Confidentiality" },
            { badge: "ISO 27001", desc: "Information Security Management" },
            { badge: "GDPR Compliance", desc: "Strict Data Portability" },
            { badge: "HIPAA Compliant", desc: "Protected Client Records" },
          ].map((cert, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
              <Shield className="w-8 h-8 text-emerald-400/70 mb-3" />
              <div className="text-xs font-bold uppercase tracking-widest text-white/80">{cert.badge}</div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-white/30 mt-1">{cert.desc}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-8 text-[10px] text-white/30 uppercase tracking-widest font-mono flex-wrap">
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> AES-256 KMS Key Rotation</span>
          <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-emerald-400" /> Isolated Schema Per Firm</span>
          <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Real-time DynamoDB Logging</span>
        </div>
      </section>

      {/* CTA Footer banner */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-transparent to-emerald-950/10 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light tracking-tighter leading-tight font-serif italic text-white mb-6">
            Empower Your Partners and Associates Today
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-10 font-mono">
            Setup takes less than 10 minutes. Fully compliant with AWS IAM.
          </p>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all"
          >
            Register Enterprise Firm <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 lg:px-16 text-center text-white/20 text-[10px] font-mono uppercase tracking-widest bg-black">
        <p>© 2026 Rayn Intelligence Systems LLC. All rights reserved. SOC 2 Certified. Powered by AWS.</p>
      </footer>
    </div>
  )
}
