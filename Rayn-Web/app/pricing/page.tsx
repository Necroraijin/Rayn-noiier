"use client"

import React, { useState } from "react"
import Link from "next/link"
import { CheckCircle2, ChevronRight, HelpCircle, ShieldAlert, Sparkles, Scale, Lock, Shield } from "lucide-react"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      id: "professional",
      name: "Professional",
      monthlyPrice: 2500,
      annualPrice: 2000,
      badge: "Growth Firms",
      limits: {
        seats: "Up to 10 Seats",
        context: "100k Tokens Context Limit",
        tokens: "20M Monthly AI Tokens",
        kms: "Standard Shared KMS Key",
      },
      features: [
        "Private Firm Vector Store (RDS pgvector)",
        "Neural Drafting Studio integration",
        "Basic Audit Logs (1 Month retention)",
        "AWS Bedrock Claude 3.5 access",
        "Email Support",
      ],
      color: "border-white/10 bg-white/[0.01]",
      btnStyle: "border border-white/20 text-white hover:bg-white/5",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      monthlyPrice: 4500,
      annualPrice: 3600,
      badge: "Partnerships & LLPs",
      featured: true,
      limits: {
        seats: "Up to 50 Seats",
        context: "200k Tokens Context Limit",
        tokens: "50M Monthly AI Tokens",
        kms: "Dedicated Tenant KMS Key",
      },
      features: [
        "All Professional features",
        "Multi-Agent Research Agent (Indian Case Law)",
        "Amazon DynamoDB Audit Logs (7 Years)",
        "Custom Style Profile Learning (RLHF)",
        "Cognito SSO & Google Workspace integration",
        "Priority 24/7 Support Desk",
      ],
      color: "border-emerald-500/30 bg-emerald-950/10 shadow-[0_0_50px_rgba(16,185,129,0.05)]",
      btnStyle: "bg-emerald-500 text-black hover:bg-emerald-400",
    },
    {
      id: "unlimited",
      name: "Unlimited",
      monthlyPrice: 9500,
      annualPrice: 7600,
      badge: "National Firms & Chambers",
      limits: {
        seats: "Unlimited Seats",
        context: "500k Tokens Context Limit",
        tokens: "200M Monthly AI Tokens",
        kms: "BYOK (Bring Your Own Key)",
      },
      features: [
        "All Enterprise features",
        "Custom Fine-Tuned LLMs via AWS Bedrock",
        "Dedicated Multi-Region S3 Storage buckets",
        "WhatsApp Business client portal webhooks",
        "On-Premises Hybrid Deployments",
        "Dedicated Solutions Architect support",
      ],
      color: "border-purple-500/20 bg-purple-950/5",
      btnStyle: "border border-purple-500/40 text-purple-300 hover:bg-purple-500/10",
    },
  ]

  const faqs = [
    {
      q: "How does the annual pricing discount work?",
      a: "Billed annually, you receive a 20% discount on the base fee. Any seat additions mid-cycle are co-termed and billed on a monthly prorated basis.",
    },
    {
      q: "Can we use our own AWS encryption keys?",
      a: "Yes. In the Unlimited plan, you can integrate your AWS KMS keys via Bring Your Own Key (BYOK) policy, giving you full cryptographic control over document decrypt events.",
    },
    {
      q: "Is our private case details used to train models?",
      a: "No. Under our AWS Bedrock terms and AWS architecture, no customer data is used for model training. All vector queries are isolated at the database level using PostgreSQL Row-Level Security.",
    },
    {
      q: "How is compliance checked?",
      a: "Every transaction, log, and access is tracked in Amazon DynamoDB. Our system generated audit trails help you satisfy SOC 2, HIPAA, and internal legal compliance audits effortlessly.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#030303] text-[#F0F0F0] font-sans selection:bg-emerald-500/30 overflow-x-hidden pb-24">
      {/* Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[400px] left-1/4 w-[400px] h-[300px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="backdrop-blur-md border-b border-white/5 bg-[#030303]/70 px-6 lg:px-16 h-20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
            <span className="text-xl font-bold tracking-tighter text-emerald-400">R.</span>
          </div>
          <div>
            <h2 className="text-md font-bold tracking-tight text-white">Rayn</h2>
            <p className="text-[8px] uppercase tracking-[0.3em] text-emerald-400/60 font-mono">Legal Intelligence</p>
          </div>
        </div>

        <nav className="flex items-center gap-8 text-[10px] uppercase font-bold tracking-widest text-white/50">
          <Link href="/" className="hover:text-white transition-colors">Platform</Link>
          <Link href="/pricing" className="text-white hover:text-white transition-colors">Pricing</Link>
          <Link href="/register" className="hover:text-white transition-colors">Register</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[10px] uppercase tracking-widest font-bold text-white/60 hover:text-white transition-colors">
            Sign In
          </Link>
        </div>
      </header>

      {/* Page Title */}
      <section className="px-6 lg:px-16 pt-16 pb-12 max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter leading-tight font-serif italic text-white mb-4">
          Simple, Transparent <span className="text-emerald-400">Pricing Tiers</span>
        </h1>
        <p className="text-xs uppercase tracking-widest text-white/40 font-mono mb-10">
          Provisioned on demand. Scaling securely.
        </p>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-[10px] uppercase font-bold tracking-widest ${!isAnnual ? "text-white" : "text-white/30"}`}>Monthly Billing</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 rounded-full bg-white/5 border border-white/10 p-0.5 relative transition-colors"
          >
            <div className={`w-4.5 h-4.5 rounded-full bg-emerald-400 transition-transform ${isAnnual ? "translate-x-6" : "translate-x-0"}`} />
          </button>
          <span className={`text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 ${isAnnual ? "text-white" : "text-white/30"}`}>
            Annual Billing <span className="text-[8px] font-mono border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/5">SAVE 20%</span>
          </span>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
            return (
              <div
                key={plan.id}
                className={`rounded-3xl border p-8 text-left flex flex-col justify-between relative transition-all duration-300 hover:border-white/20 ${plan.color}`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-6 px-3 py-1 bg-emerald-500 text-black text-[9px] font-bold uppercase tracking-widest rounded-full">
                    Most Popular
                  </span>
                )}
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-light font-serif italic text-white">{plan.name}</h3>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-white/30 mt-1">{plan.badge}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <span className="text-4xl font-mono text-white">${price.toLocaleString()}</span>
                    <span className="text-xs text-white/30 font-mono"> / mo</span>
                    <p className="text-[9px] text-white/30 font-mono uppercase tracking-widest mt-2">
                      {isAnnual ? `Billed $${(price * 12).toLocaleString()}/year` : "Billed monthly"}
                    </p>
                  </div>

                  {/* Resource Limits List */}
                  <div className="space-y-2.5 pb-6 border-b border-white/5 mb-6 text-[10px] font-mono uppercase tracking-widest text-white/50">
                    <div>• {plan.limits.seats}</div>
                    <div>• {plan.limits.context}</div>
                    <div>• {plan.limits.tokens}</div>
                    <div>• {plan.limits.kms}</div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-4">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Features Included:</p>
                    {plan.features.map((feat, index) => (
                      <div key={index} className="flex items-start gap-2.5 text-xs text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10">
                  <Link
                    href={`/register?plan=${plan.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${plan.btnStyle}`}
                  >
                    Select {plan.name} <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Compliance Advisory */}
      <section className="max-w-4xl mx-auto px-6 mt-16">
        <div className="border border-white/5 rounded-2xl p-6 bg-white/[0.01] flex flex-col md:flex-row gap-4 items-center justify-between text-left">
          <div className="flex gap-4 items-start">
            <HelpCircle className="w-10 h-10 text-emerald-400/80 shrink-0 mt-1" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/80">Need custom parameters?</h4>
              <p className="text-xs text-white/50 leading-relaxed mt-1">
                We design tailored deployment models, including high-scale seat expansions, dedicated AWS instances, and specific regional hosting rules.
              </p>
            </div>
          </div>
          <button className="px-6 py-3 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap shrink-0">
            Contact Sales
          </button>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-6 mt-24">
        <h3 className="text-center text-xs uppercase tracking-[0.25em] font-bold text-emerald-400 mb-12">Billing & Integration FAQs</h3>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-2 text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/80">{faq.q}</h4>
              <p className="text-xs text-white/50 leading-relaxed font-serif">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
