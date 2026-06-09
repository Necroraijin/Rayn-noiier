"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Receipt, Key, CreditCard, Users, Minus, Plus, Zap, Crown, Sparkles, FileText, CheckCircle2 } from "lucide-react"
import { useTenant } from "@/lib/tenant-context"
import { useAuditLog } from "@/lib/audit-logger"
import { useAuth } from "@/lib/auth-context"

const PLAN_DETAILS = {
  professional: {
    name: "Professional",
    price: 2500,
    contextLimit: "100k",
    monthlyBudget: "20M",
    features: ["Up to 10 seats", "100k context window", "20M monthly tokens", "Standard support", "SOC 2 compliance"],
    icon: Zap,
    color: "blue",
  },
  enterprise: {
    name: "Enterprise",
    price: 4500,
    contextLimit: "200k",
    monthlyBudget: "50M",
    features: ["Up to 50 seats", "200k context window", "50M monthly tokens", "Priority support", "SOC 2 + HIPAA", "Custom AI models"],
    icon: Crown,
    color: "emerald",
  },
  unlimited: {
    name: "Unlimited",
    price: 9500,
    contextLimit: "500k",
    monthlyBudget: "200M",
    features: ["Unlimited seats", "500k context window", "200M monthly tokens", "24/7 dedicated support", "Full compliance suite", "Custom AI models", "On-premise option"],
    icon: Sparkles,
    color: "purple",
  },
}

export function BillingSettings() {
  const { tenant, addSeat, removeSeat, updatePlan } = useTenant()
  const { log } = useAuditLog()
  const { email } = useAuth()
  const currentPlan = PLAN_DETAILS[tenant.plan]
  const seatPrice = tenant.plan === "professional" ? 150 : tenant.plan === "enterprise" ? 200 : 0
  const totalMonthly = currentPlan.price + (tenant.seatsTotal * seatPrice)

  const handleAddSeat = () => {
    addSeat()
    log({
      tenantId: tenant.id,
      category: "BILLING",
      event: "SEAT_ADDED",
      actor: email || "admin",
      ip: "192.168.1.1",
      severity: "INFO",
      details: `Added 1 seat (total: ${tenant.seatsTotal + 1})`,
    })
  }

  const handleRemoveSeat = () => {
    if (tenant.seatsTotal <= tenant.seatsUsed) return
    removeSeat()
    log({
      tenantId: tenant.id,
      category: "BILLING",
      event: "SEAT_REMOVED",
      actor: email || "admin",
      ip: "192.168.1.1",
      severity: "INFO",
      details: `Removed 1 seat (total: ${tenant.seatsTotal - 1})`,
    })
  }

  const handlePlanChange = async (plan: "professional" | "enterprise" | "unlimited") => {
    if (plan === tenant.plan) return
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      } else {
        console.warn("Stripe Checkout URL generation skipped/unavailable, falling back to local DB updates: ", data.error)
      }
    } catch (err) {
      console.error("Stripe Checkout redirection failed, falling back to local DB updates: ", err)
    }

    updatePlan(plan)
    log({
      tenantId: tenant.id,
      category: "BILLING",
      event: "PLAN_CHANGED",
      actor: email || "admin",
      ip: "192.168.1.1",
      severity: "WARNING",
      details: `Changed plan from ${currentPlan.name} to ${PLAN_DETAILS[plan].name}`,
    })
  }

  const tokenPercent = Math.round((tenant.aiTokensUsed / tenant.aiMonthlyBudget) * 100)

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Current Plan & Usage */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        <Card className={`${tenant.plan === "enterprise" ? "bg-emerald-500/10 border-emerald-500/20" : tenant.plan === "unlimited" ? "bg-purple-500/10 border-purple-500/20" : "bg-blue-500/10 border-blue-500/20"} rounded-2xl shadow-none col-span-1 md:col-span-2`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-light font-serif italic text-white/90">Current Plan: {currentPlan.name}</CardTitle>
                <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">
                  {tenant.name} · Billed Monthly
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 uppercase tracking-widest text-[9px] font-mono">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-8 mb-8">
              <div>
                <p className="text-[10px] uppercase text-white/40 tracking-widest font-bold mb-1">Base + Seats</p>
                <p className="text-3xl font-mono text-white">${totalMonthly.toLocaleString()}<span className="text-sm text-white/30">/mo</span></p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 tracking-widest font-bold mb-1">Context Window</p>
                <p className="text-3xl font-mono text-white">{currentPlan.contextLimit}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 tracking-widest font-bold mb-1">AI Token Budget</p>
                <p className="text-3xl font-mono text-white">{currentPlan.monthlyBudget}<span className="text-sm text-white/30"> tokens</span></p>
              </div>
            </div>

            {/* Token usage bar */}
            <div className="mb-6">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest mb-2">
                <span className="text-white/40">Monthly Token Usage</span>
                <span className={tokenPercent > 80 ? "text-yellow-400" : "text-emerald-400"}>{tokenPercent}% — {(tenant.aiTokensUsed / 1000000).toFixed(1)}M / {(tenant.aiMonthlyBudget / 1000000).toFixed(0)}M</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${tokenPercent > 80 ? "bg-yellow-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min(tokenPercent, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="bg-white text-black hover:bg-white/90 rounded uppercase tracking-widest text-[10px] font-bold border-none">View Invoices</Button>
              <Button variant="outline" className="border-white/20 text-white/80 hover:bg-white/10 rounded uppercase tracking-widest text-[10px] font-bold">Download Receipt</Button>
            </div>
          </CardContent>
        </Card>

        {/* Seat Management */}
        <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-light font-serif italic text-white/90">Seat Management</CardTitle>
            <CardDescription className="text-[10px] tracking-widest uppercase text-white/40 mt-1">
              ${seatPrice > 0 ? `$${seatPrice}/seat/mo` : "Unlimited seats"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white/80">Allocated Seats</p>
                <p className="text-[10px] text-white/40 mt-1 font-mono">{tenant.seatsUsed} active / {tenant.seatsTotal} total</p>
              </div>
              <div className="text-3xl font-mono text-white">{tenant.seatsUsed}<span className="text-white/30">/{tenant.seatsTotal}</span></div>
            </div>

            {/* Seat visual */}
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: tenant.seatsTotal }).map((_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-mono ${
                    i < tenant.seatsUsed
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                      : "bg-white/[0.03] border border-white/[0.06] text-white/20"
                  }`}
                >
                  <Users className="w-3 h-3" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveSeat}
                disabled={tenant.seatsTotal <= tenant.seatsUsed}
                className="h-9 flex-1 border-white/10 text-white/60 hover:bg-white/5 rounded-lg"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSeat}
                className="h-9 flex-1 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/5 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Comparison */}
      <div>
        <h3 className="text-sm font-bold tracking-widest uppercase text-white/80 mb-6">Available Plans</h3>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {(Object.entries(PLAN_DETAILS) as [keyof typeof PLAN_DETAILS, typeof PLAN_DETAILS[keyof typeof PLAN_DETAILS]][]).map(([key, plan]) => {
            const isActive = key === tenant.plan
            const colorClasses = {
              blue: "border-blue-500/20 bg-blue-500/5",
              emerald: "border-emerald-500/20 bg-emerald-500/5",
              purple: "border-purple-500/20 bg-purple-500/5",
            }
            const planColor = plan.color as keyof typeof colorClasses
            return (
              <Card key={key} className={`rounded-2xl shadow-none transition-all ${isActive ? `${colorClasses[planColor]} ring-1 ring-${planColor}-500/30` : "bg-white/[0.02] border-white/10"}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <plan.icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-white/30"}`} />
                      <CardTitle className="text-sm font-bold text-white/90">{plan.name}</CardTitle>
                    </div>
                    {isActive && <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[9px] font-mono uppercase tracking-widest">Current</Badge>}
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-mono text-white">${plan.price.toLocaleString()}</span>
                    <span className="text-sm text-white/30 font-mono">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-emerald-400" : "text-white/20"}`} />
                        {f}
                      </div>
                    ))}
                  </div>
                  {!isActive && (
                    <Button
                      onClick={() => handlePlanChange(key)}
                      variant="outline"
                      className="w-full border-white/20 text-white/70 hover:text-white hover:bg-white/10 rounded-xl uppercase tracking-widest text-[10px] font-bold mt-4"
                    >
                      {PLAN_DETAILS[key].price > currentPlan.price ? "Upgrade" : "Downgrade"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Invoices */}
      <Card className="bg-white/[0.02] border-white/10 rounded-2xl shadow-none">
        <CardHeader>
          <CardTitle className="text-sm font-bold tracking-widest uppercase text-white/90">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { id: "INV-2026-06", date: "Jun 1, 2026", amount: `$${totalMonthly.toLocaleString()}.00`, status: "Pending" },
              { id: "INV-2026-05", date: "May 1, 2026", amount: `$${totalMonthly.toLocaleString()}.00`, status: "Paid" },
              { id: "INV-2026-04", date: "Apr 1, 2026", amount: `$${(totalMonthly - 200).toLocaleString()}.00`, status: "Paid" },
            ].map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <Receipt className="h-4 w-4 text-white/40" />
                  <div>
                    <p className="text-xs font-mono font-bold text-white">{inv.id}</p>
                    <p className="text-[10px] text-white/40">{inv.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-sm font-mono text-white/80">{inv.amount}</p>
                  <Badge variant="outline" className={`${inv.status === "Paid" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" : "border-yellow-500/30 text-yellow-400 bg-yellow-500/5"}`}>
                    {inv.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white shrink-0 -mr-2"><FileText className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
